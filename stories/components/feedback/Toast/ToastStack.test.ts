import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/vue";
import { nextTick } from "vue";
import ToastStack from "./ToastStack.vue";

afterEach(cleanup);

describe("ToastStack", () => {
  // jsdom has no popover API; this stands in for the browser's top layer.
  const shown: HTMLElement[] = [];
  let open = new Set<HTMLElement>();

  beforeEach(() => {
    shown.length = 0;
    open = new Set();
    HTMLElement.prototype.showPopover = vi.fn(function (this: HTMLElement) {
      open.add(this);
      shown.push(this);
    });
    HTMLElement.prototype.hidePopover = vi.fn(function (this: HTMLElement) {
      open.delete(this);
    });
    const matches = Element.prototype.matches;
    vi.spyOn(Element.prototype, "matches").mockImplementation(function (
      this: Element,
      selector: string
    ) {
      // jsdom has no modal dialogs either; an open one stands in for them.
      if (selector === ":modal") return this.hasAttribute("open");

      return selector === ":popover-open"
        ? open.has(this as HTMLElement)
        : matches.call(this, selector);
    });
  });

  afterEach(() => vi.restoreAllMocks());

  it("is a manual popover, shown only once there are toasts", () => {
    render(ToastStack);

    const stack = document.querySelector("[popover]");

    expect(stack?.getAttribute("popover")).toBe("manual");
    expect(shown).toEqual([]);
  });

  it("raises the stack with every new toast and hides it once empty", async () => {
    let exposed:
      | { add: (o: { message: string }) => number; dismissAll: () => void }
      | undefined;

    render({
      components: { ToastStack },
      setup() {
        return {
          setRef: (value: typeof exposed) => {
            exposed = value ?? exposed;
          },
        };
      },
      template: `<ToastStack :ref="setRef" />`,
    });

    exposed!.add({ message: "Saved" });
    await nextTick();
    await nextTick();
    exposed!.add({ message: "Saved again" });
    await nextTick();
    await nextTick();

    const stack = document.querySelector("[popover]") as HTMLElement;

    // Shown again for the second toast, so it comes above later dialogs.
    expect(shown).toEqual([stack, stack]);
    expect(HTMLElement.prototype.hidePopover).toHaveBeenCalledTimes(1);
    expect(open.has(stack)).toBe(true);

    exposed!.dismissAll();
    await nextTick();

    expect(open.has(stack)).toBe(false);
  });

  it("moves into an open modal dialog, so the toasts stay interactive", async () => {
    render(ToastStack);

    const stack = document.querySelector("[popover]") as HTMLElement;
    const dialog = document.createElement("dialog");
    const settle = async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      await nextTick();
    };

    document.body.append(dialog);
    dialog.setAttribute("open", "");
    await settle();

    expect(stack.parentElement).toBe(dialog);

    dialog.removeAttribute("open");
    await settle();

    expect(stack.parentElement).toBe(document.body);

    dialog.remove();
  });
});
