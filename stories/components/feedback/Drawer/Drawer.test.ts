import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/vue";
import Drawer from "./Drawer.vue";

// jsdom has HTMLDialogElement but neither showModal() nor close().
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    if (!this.hasAttribute("open")) return;
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("Drawer", () => {
  it("opens as a modal dialog named by its title", () => {
    const showModal = vi.spyOn(HTMLDialogElement.prototype, "showModal");
    render(Drawer, {
      props: { title: "Settings", open: true },
      slots: { default: "Drawer body" },
    });
    expect(showModal).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("dialog", { name: "Settings" })).toBeTruthy();
    expect(screen.getByText("Drawer body")).toBeTruthy();
  });

  it("opens and closes when the open prop changes", async () => {
    const { rerender, emitted } = render(Drawer, {
      props: { title: "Settings", open: false },
    });
    expect(screen.queryByRole("dialog")).toBeNull();

    await rerender({ title: "Settings", open: true });
    expect(screen.getByRole("dialog", { name: "Settings" })).toBeTruthy();

    await rerender({ title: "Settings", open: false });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(emitted().close).toBeUndefined();
  });

  it("emits close from the close button and the backdrop", async () => {
    const { emitted } = render(Drawer, {
      props: { title: "Settings", open: true },
    });
    await fireEvent.click(screen.getByRole("button", { name: "Close" }));
    await fireEvent.pointerDown(screen.getByRole("dialog"));
    await fireEvent.click(screen.getByRole("dialog"));
    expect(emitted().close).toHaveLength(2);
  });

  it("stays open when a drag from inside ends on the backdrop", async () => {
    const { emitted } = render(Drawer, {
      props: { title: "Settings", open: true },
      slots: { default: "Drawer body" },
    });
    await fireEvent.pointerDown(screen.getByText("Drawer body"));
    await fireEvent.click(screen.getByRole("dialog"));
    expect(emitted().close).toBeUndefined();
  });

  it("emits close when dismissed natively, e.g. with Escape", async () => {
    const { emitted } = render(Drawer, {
      props: { title: "Settings", open: true },
    });
    (screen.getByRole("dialog") as HTMLDialogElement).close();
    expect(emitted().close).toHaveLength(1);
  });

  it("cannot be dismissed while persistent", async () => {
    const { emitted } = render(Drawer, {
      props: { title: "Settings", open: true, persistent: true },
    });
    const dialog = screen.getByRole("dialog");
    expect(screen.queryByRole("button", { name: "Close" })).toBeNull();

    await fireEvent.click(dialog);
    const cancel = new Event("cancel", { cancelable: true });
    dialog.dispatchEvent(cancel);

    expect(cancel.defaultPrevented).toBe(true);
    expect(emitted().close).toBeUndefined();
  });

  it("blocks Escape itself while persistent, since Chrome stops honoring a prevented cancel", async () => {
    const { rerender } = render(Drawer, {
      props: { title: "Settings", open: true, persistent: true },
    });
    const escape = () => {
      const event = new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
        cancelable: true,
      });
      screen.getByRole("dialog").dispatchEvent(event);
      return event.defaultPrevented;
    };
    expect(escape()).toBe(true);

    await rerender({ title: "Settings", open: true, persistent: false });
    expect(escape()).toBe(false);
  });

  it("keeps a max height on top and bottom drawers only", async () => {
    const { rerender } = render(Drawer, {
      props: { title: "Settings", open: true, side: "bottom" },
    });
    const classes = () => screen.getByRole("dialog").classList;
    expect(classes().contains("max-h-[80dvh]")).toBe(true);
    expect(classes().contains("max-h-none")).toBe(false);

    await rerender({ title: "Settings", open: true, side: "left" });
    expect(classes().contains("max-h-none")).toBe(true);
  });

  it("renders the footer slot only when provided", () => {
    render(Drawer, {
      props: { title: "Settings", open: true },
      slots: { footer: "<button>Save</button>" },
    });
    expect(screen.getByRole("button", { name: "Save" })).toBeTruthy();
  });

  it("uses the locale override for the close label", () => {
    render(Drawer, {
      props: { title: "Settings", open: true, locale: { close: "Schließen" } },
    });
    expect(screen.getByRole("button", { name: "Schließen" })).toBeTruthy();
  });
});
