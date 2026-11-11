import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/vue";
import { defineComponent, h, nextTick } from "vue";
import DatePicker from "./DatePicker.vue";

vi.mock("@/components", () => ({
  Icon: { template: "<svg />" },
  Select: { template: "<div />" },
}));

afterEach(cleanup);

const calendar = () =>
  document.querySelector<HTMLElement>("[data-datepicker-calendar]");

/** A DatePicker inside a native dialog's scrolling body. */
function renderInDialog() {
  render(
    defineComponent({
      setup: () => () =>
        h("dialog", { open: true }, [
          h("div", { style: "overflow: auto" }, [
            h(DatePicker, { ariaLabel: "Release date", teleportTo: "body" }),
          ]),
        ]),
    })
  );

  return {
    dialog: document.querySelector("dialog")!,
    trigger: screen.getByRole("button", { name: "Release date" }),
  };
}

describe("DatePicker portals", () => {
  it("opens into the native dialog when clicked, not beneath it", async () => {
    const { dialog, trigger } = renderInDialog();

    await fireEvent.click(trigger);
    await nextTick();

    expect(calendar()?.parentElement).toBe(dialog);
    expect(trigger.getAttribute("aria-controls")).toBe(calendar()?.id);

    await fireEvent.click(trigger);
    await nextTick();

    expect(calendar()).toBeNull();
  });

  it("opens into the native dialog from the keyboard", async () => {
    const { dialog, trigger } = renderInDialog();

    await fireEvent.keyDown(trigger, { key: "Enter" });
    await nextTick();

    expect(calendar()?.parentElement).toBe(dialog);
  });

  it("keeps the calendar's own width instead of the trigger's", async () => {
    const { trigger } = renderInDialog();

    await fireEvent.click(trigger);

    // Positioning is async; the size middleware caps the height once it ran.
    await vi.waitFor(() => expect(calendar()?.style.maxHeight).not.toBe(""));

    expect(calendar()?.style.width).toBe("");
    expect(calendar()?.classList).toContain("fixed");
  });
});
