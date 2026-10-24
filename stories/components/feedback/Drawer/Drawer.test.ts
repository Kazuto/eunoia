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
    await fireEvent.click(screen.getByRole("dialog"));
    expect(emitted().close).toHaveLength(2);
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
