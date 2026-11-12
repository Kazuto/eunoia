import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/vue";
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
  const onPick = vi.fn();

  render(
    defineComponent({
      setup: () => () =>
        h("dialog", { open: true }, [
          h("div", { style: "overflow: auto" }, [
            h(DatePicker, {
              ariaLabel: "Release date",
              teleportTo: "body",
              "onUpdate:modelValue": onPick,
            }),
          ]),
        ]),
    })
  );

  return {
    dialog: document.querySelector("dialog")!,
    trigger: screen.getByRole("button", { name: "Release date" }),
    onPick,
  };
}

/** The calendar's button with this text, e.g. a day. */
const calendarButton = (text: string) =>
  within(calendar()!)
    .getAllByRole("button")
    .find((button) => button.textContent?.trim() === text)!;

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

  it("picks a day in a dialog, though focus leaves the trigger for the calendar", async () => {
    const { trigger, onPick } = renderInDialog();

    await fireEvent.click(trigger);
    await nextTick();

    // What a click does: mousedown, focus moves to the day, then the click.
    const day = calendarButton("15");

    await fireEvent.mouseDown(day);
    await fireEvent.focusOut(trigger, { relatedTarget: day });
    await fireEvent.click(day);

    expect(onPick).toHaveBeenCalledOnce();
    expect((onPick.mock.calls[0]![0] as Date).getDate()).toBe(15);
    expect(calendar()).not.toBeNull();
  });

  it("closes once focus leaves the teleported calendar", async () => {
    const { trigger } = renderInDialog();
    const outside = document.createElement("button");

    document.body.append(outside);

    try {
      await fireEvent.click(trigger);
      await nextTick();
      await fireEvent.focusOut(calendarButton("15"), {
        relatedTarget: outside,
      });

      expect(calendar()).toBeNull();
    } finally {
      outside.remove();
    }
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
