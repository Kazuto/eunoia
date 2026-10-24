import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/vue";
import Dialog from "./Dialog.vue";

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

function escape(dialog: HTMLElement) {
  const event = new KeyboardEvent("keydown", {
    key: "Escape",
    bubbles: true,
    cancelable: true,
  });
  dialog.dispatchEvent(event);
  return event.defaultPrevented;
}

describe("Dialog", () => {
  it("opens when open is already true at mount", () => {
    const showModal = vi.spyOn(HTMLDialogElement.prototype, "showModal");
    render(Dialog, {
      props: { title: "Rename", open: true },
      slots: { default: "Dialog body" },
    });
    expect(showModal).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("dialog", { name: "Rename" })).toBeTruthy();
    expect(screen.getByText("Dialog body")).toBeTruthy();
  });

  it("does not emit close when the parent closes it", async () => {
    const { rerender, emitted } = render(Dialog, {
      props: { title: "Rename", open: false },
    });
    expect(screen.queryByRole("dialog")).toBeNull();

    await rerender({ title: "Rename", open: true });
    expect(screen.getByRole("dialog", { name: "Rename" })).toBeTruthy();

    await rerender({ title: "Rename", open: false });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(emitted().close).toBeUndefined();
  });

  it("emits close when dismissed natively, e.g. with Escape", () => {
    const { emitted } = render(Dialog, {
      props: { title: "Rename", open: true },
    });
    (screen.getByRole("dialog") as HTMLDialogElement).close();
    expect(emitted().close).toHaveLength(1);
  });

  it("emits close from the close button and the backdrop", async () => {
    const { emitted } = render(Dialog, {
      props: { title: "Rename", open: true },
    });
    await fireEvent.click(screen.getByRole("button", { name: "Close" }));
    await fireEvent.pointerDown(screen.getByRole("dialog"));
    await fireEvent.click(screen.getByRole("dialog"));
    expect(emitted().close).toHaveLength(2);
  });

  it("stays open when a drag from inside ends on the backdrop", async () => {
    const { emitted } = render(Dialog, {
      props: { title: "Rename", open: true },
      slots: { default: "Dialog body" },
    });
    await fireEvent.pointerDown(screen.getByText("Dialog body"));
    await fireEvent.click(screen.getByRole("dialog"));
    expect(emitted().close).toBeUndefined();
  });

  it("cannot be dismissed while persistent", async () => {
    const { emitted } = render(Dialog, {
      props: { title: "Rename", open: true, persistent: true },
    });
    const dialog = screen.getByRole("dialog");
    expect(screen.queryByRole("button", { name: "Close" })).toBeNull();

    await fireEvent.pointerDown(dialog);
    await fireEvent.click(dialog);
    const cancel = new Event("cancel", { cancelable: true });
    dialog.dispatchEvent(cancel);

    expect(cancel.defaultPrevented).toBe(true);
    // Chrome stops honoring a prevented cancel after repeated Escapes, so the key is blocked too.
    expect(escape(dialog)).toBe(true);
    expect(emitted().close).toBeUndefined();
  });

  it("leaves Escape alone when not persistent", () => {
    render(Dialog, { props: { title: "Rename", open: true } });
    expect(escape(screen.getByRole("dialog"))).toBe(false);
  });
});
