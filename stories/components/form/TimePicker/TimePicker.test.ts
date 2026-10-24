import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/vue";
import { nextTick } from "vue";
import TimePicker from "./TimePicker.vue";

vi.mock("@/components", () => ({
  Icon: { template: "<svg />" },
}));

afterEach(cleanup);

function renderPicker(props: Record<string, unknown> = {}) {
  return render(TimePicker, {
    props,
    slots: { default: "Start time" },
  });
}

function trigger() {
  return screen.getByRole("button", { name: /^Start time/ });
}

async function open() {
  await fireEvent.click(trigger());
  await nextTick();
}

describe("TimePicker", () => {
  it("names the trigger with its label and current value", () => {
    renderPicker({ modelValue: "14:30" });
    expect(trigger().getAttribute("aria-expanded")).toBe("false");
    expect(trigger().textContent).toContain("14:30");
  });

  it("opens hour and minute listboxes and focuses the first column", async () => {
    renderPicker();
    await open();

    expect(screen.getByRole("dialog", { name: "Time picker" })).toBeTruthy();
    const hours = screen.getByRole("listbox", { name: "Hours" });
    expect(screen.getByRole("listbox", { name: "Minutes" })).toBeTruthy();
    expect(screen.queryByRole("listbox", { name: "Seconds" })).toBeNull();
    expect(document.activeElement).toBe(hours);
    expect(trigger().getAttribute("aria-expanded")).toBe("true");
  });

  it("builds the value from clicked options, defaulting unset parts to zero", async () => {
    const { emitted } = renderPicker();
    await open();

    const hours = screen.getByRole("listbox", { name: "Hours" });
    await fireEvent.click(within(hours).getByRole("option", { name: "14" }));
    const minutes = screen.getByRole("listbox", { name: "Minutes" });
    await fireEvent.click(within(minutes).getByRole("option", { name: "30" }));

    expect(emitted()["update:modelValue"]).toEqual([["14:00"], ["14:30"]]);
  });

  it("steps through a column with the arrow keys and closes on Enter", async () => {
    const { emitted } = renderPicker({ modelValue: "09:15" });
    await open();
    const hours = screen.getByRole("listbox", { name: "Hours" });
    expect(hours.getAttribute("aria-activedescendant")).toBe(
      within(hours).getByRole("option", { name: "09", selected: true }).id
    );

    await fireEvent.keyDown(hours, { key: "ArrowDown" });
    expect(emitted()["update:modelValue"]).toEqual([["10:15"]]);

    await fireEvent.keyDown(hours, { key: "End" });
    expect(emitted()["update:modelValue"]).toEqual([["10:15"], ["23:15"]]);

    await fireEvent.keyDown(hours, { key: "Enter" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  it("opens with ArrowDown and closes on Escape", async () => {
    renderPicker();
    await fireEvent.keyDown(trigger(), { key: "ArrowDown" });
    await nextTick();
    const hours = screen.getByRole("listbox", { name: "Hours" });

    await fireEvent.keyDown(hours, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  it("offers minutes in the configured step", async () => {
    renderPicker({ step: 15 });
    await open();
    const minutes = screen.getByRole("listbox", { name: "Minutes" });
    const labels = Array.from(minutes.querySelectorAll('[role="option"]')).map(
      (o) => o.textContent?.trim()
    );
    expect(labels).toEqual(["00", "15", "30", "45"]);
  });

  it("adds a seconds column and emits HH:mm:ss", async () => {
    const { emitted } = renderPicker({ seconds: true, modelValue: "08:05:00" });
    await open();
    const seconds = screen.getByRole("listbox", { name: "Seconds" });
    await fireEvent.keyDown(seconds, { key: "ArrowDown" });
    expect(emitted()["update:modelValue"]).toEqual([["08:05:01"]]);
  });

  it("shows 12-hour columns but keeps a 24-hour model", async () => {
    const { emitted } = renderPicker({ hour12: true, modelValue: "21:15" });
    expect(trigger().textContent).toMatch(/9:15/);
    await open();

    const listboxes = screen.getAllByRole("listbox");
    expect(listboxes).toHaveLength(3);
    const hours = screen.getByRole("listbox", { name: "Hours" });
    expect(hours.querySelector('[role="option"]')?.textContent?.trim()).toBe(
      "12"
    );

    const period = listboxes[2];
    await fireEvent.keyDown(period, { key: "Home" });
    expect(emitted()["update:modelValue"]).toEqual([["09:15"]]);
  });

  it("clears the value", async () => {
    const { emitted } = renderPicker({ modelValue: "10:00" });
    await fireEvent.click(
      screen.getByRole("button", { name: "Clear selection" })
    );
    expect(emitted()["update:modelValue"]).toEqual([[null]]);
  });

  it("does not open or offer clearing while disabled", async () => {
    renderPicker({ modelValue: "10:00", disabled: true });
    expect((trigger() as HTMLButtonElement).disabled).toBe(true);
    await fireEvent.keyDown(trigger(), { key: "ArrowDown" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(
      screen.queryByRole("button", { name: "Clear selection" })
    ).toBeNull();
  });

  it("closes when clicking outside", async () => {
    renderPicker();
    await open();
    await fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
