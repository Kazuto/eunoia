import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/vue";
import { h, nextTick } from "vue";
import Popover from "./Popover.vue";

afterEach(cleanup);

function renderPopover(props: Record<string, unknown> = {}) {
  return render(Popover, {
    props: { label: "Share", ...props },
    slots: {
      default: () => [h("p", "Anyone with the link"), h("button", "Copy link")],
    },
  });
}

const trigger = () => screen.getByRole("button", { name: "Share" });

describe("Popover", () => {
  it("opens a named dialog on click and points the trigger at it", async () => {
    const { emitted } = renderPopover();
    expect(trigger().getAttribute("aria-haspopup")).toBe("dialog");
    expect(trigger().getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("dialog")).toBeNull();

    await fireEvent.click(trigger());
    await nextTick();

    const panel = screen.getByRole("dialog", { name: "Share" });
    expect(trigger().getAttribute("aria-expanded")).toBe("true");
    expect(trigger().getAttribute("aria-controls")).toBe(panel.id);
    expect(emitted()["update:open"]).toEqual([[true]]);
  });

  it("moves focus to the first focusable element inside", async () => {
    renderPopover();
    await fireEvent.click(trigger());
    await nextTick();
    await nextTick();

    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Copy link" })
    );
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    renderPopover();
    await fireEvent.click(trigger());
    await nextTick();
    await nextTick();

    await fireEvent.keyDown(document.activeElement!, { key: "Escape" });
    await nextTick();

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  it("closes on a click outside but not on a click inside", async () => {
    renderPopover();
    await fireEvent.click(trigger());
    await nextTick();

    await fireEvent.mouseDown(screen.getByText("Anyone with the link"));
    await nextTick();
    expect(screen.getByRole("dialog")).toBeTruthy();

    await fireEvent.mouseDown(document.body);
    await nextTick();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("follows the open model", async () => {
    const { rerender } = renderPopover({ open: true });
    await nextTick();
    expect(screen.getByRole("dialog")).toBeTruthy();

    await rerender({ open: false });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("does not open while disabled", async () => {
    const { emitted } = renderPopover({ disabled: true });
    expect(trigger().hasAttribute("disabled")).toBe(true);

    await fireEvent.click(trigger());
    await nextTick();

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(emitted()["update:open"]).toBeUndefined();
  });
});
