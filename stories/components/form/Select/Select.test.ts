import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/vue";
import { defineComponent, h, nextTick } from "vue";
import Select from "./Select.vue";

vi.mock("@/components", () => ({
  Icon: { template: "<svg />" },
  Chip: { template: "<span><slot /></span>" },
}));

afterEach(cleanup);

const options = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
];

describe("Select keyboard", () => {
  it("ignores arrow keys and Enter without options", async () => {
    const errorHandler = vi.fn();
    const { emitted } = render(Select, {
      props: { options: [], ariaLabel: "Fruit" },
      global: { config: { errorHandler } },
    });
    const trigger = screen.getByRole("combobox");

    await fireEvent.keyDown(trigger, { key: "ArrowDown" });
    await fireEvent.keyDown(trigger, { key: "ArrowUp" });
    await fireEvent.keyDown(trigger, { key: "Home" });
    expect(trigger.getAttribute("aria-activedescendant")).toBeNull();
    await fireEvent.keyDown(trigger, { key: "Enter" });

    expect(errorHandler).not.toHaveBeenCalled();
    expect(emitted()["update:modelValue"]).toBeUndefined();
  });

  it("keeps the active option in range when the options shrink while open", async () => {
    const { emitted, rerender } = render(Select, {
      props: { options, ariaLabel: "Fruit" },
    });
    const trigger = screen.getByRole("combobox");
    await fireEvent.keyDown(trigger, { key: "ArrowDown" });
    await fireEvent.keyDown(trigger, { key: "End" });

    await rerender({ options: [options[0]] });

    const [only] = screen.getAllByRole("option");
    expect(trigger.getAttribute("aria-activedescendant")).toBe(only.id);
    await fireEvent.keyDown(trigger, { key: "Enter" });
    expect(emitted()["update:modelValue"]).toEqual([["apple"]]);
  });

  it("keeps the red border of the invalid state in dark mode", () => {
    render(Select, { props: { options, invalid: true, ariaLabel: "Fruit" } });
    const classes = screen.getByRole("combobox").className.split(" ");
    expect(classes).toContain("dark:border-red-700");
    expect(classes).not.toContain("dark:border-neutral-700");
  });
});

describe("Select portals", () => {
  it("keeps portaled option clicks inside the Select and dismisses outside clicks", async () => {
    const { container, emitted } = render(Select, {
      props: {
        options,
        multiple: true,
        teleportTo: "body",
        ariaLabel: "Fruit",
      },
    });
    await fireEvent.click(screen.getByRole("combobox"));
    const listbox = screen.getByRole("listbox");
    expect(listbox.parentElement).toBe(document.body);
    expect(container.contains(listbox)).toBe(false);
    await fireEvent.mouseDown(screen.getByRole("option", { name: "Apple" }));
    await fireEvent.click(screen.getByRole("option", { name: "Apple" }));
    expect(emitted()["update:modelValue"]).toEqual([[["apple"]]]);
    expect(screen.getByRole("listbox")).toBe(listbox);
    await fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("uses the requested HTMLElement outside dialogs", async () => {
    const target = document.createElement("div");
    document.body.append(target);
    try {
      render(Select, { props: { options, teleportTo: target } });
      await fireEvent.click(screen.getByRole("combobox"));
      expect(screen.getByRole("listbox").parentElement).toBe(target);
    } finally {
      cleanup();
      target.remove();
    }
  });

  it("owns its portal in a native dialog and consumes only the first Escape", async () => {
    const onKeydown = vi.fn();
    render(
      defineComponent({
        setup: () => () =>
          h("dialog", { open: true, onKeydown }, [
            h("div", { style: "overflow: auto" }, [
              h(Select, { options, teleportTo: "body" }),
            ]),
          ]),
      })
    );
    const trigger = screen.getByRole("combobox");
    const dialog = screen.getByRole("dialog");
    await fireEvent.keyDown(trigger, { key: "ArrowDown" });
    expect(screen.getByRole("listbox").parentElement).toBe(dialog);
    onKeydown.mockClear();
    const firstEscape = new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
      cancelable: true,
    });
    trigger.dispatchEvent(firstEscape);
    await nextTick();
    expect(firstEscape.defaultPrevented).toBe(true);
    expect(onKeydown).not.toHaveBeenCalled();
    expect(screen.queryByRole("listbox")).toBeNull();
    const secondEscape = new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
      cancelable: true,
    });
    trigger.dispatchEvent(secondEscape);
    expect(secondEscape.defaultPrevented).toBe(false);
    expect(onKeydown).toHaveBeenCalledOnce();

    await fireEvent.click(trigger);
    await fireEvent(dialog, new Event("close"));
    expect(screen.queryByRole("listbox")).toBeNull();
  });
});
