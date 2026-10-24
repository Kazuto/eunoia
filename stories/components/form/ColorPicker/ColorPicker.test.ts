import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/vue";
import { defineComponent, h } from "vue";
import ColorPicker from "./ColorPicker.vue";

afterEach(cleanup);

async function openPicker(props: Record<string, unknown> = {}) {
  const result = render(ColorPicker, {
    props: { modelValue: "#a88bc7", ...props },
    slots: { default: "Accent" },
  });
  await fireEvent.click(screen.getByRole("button", { name: /^Accent/ }));
  return result;
}

function renderInside(tag: string, attrs: Record<string, unknown>) {
  return render(
    defineComponent({
      setup: () => () =>
        h(tag, attrs, [
          h(ColorPicker, { modelValue: "#a88bc7" }, () => "Accent"),
        ]),
    })
  );
}

describe("ColorPicker", () => {
  it("names the trigger by its label and opens a dialog panel", async () => {
    await openPicker();
    const trigger = screen.getByRole("button", { name: "Accent #a88bc7" });
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("dialog", { name: "Color picker" })).toBeTruthy();
    expect(
      screen.getByRole("slider", { name: "Saturation and brightness" })
    ).toBeTruthy();
    expect(screen.getByRole("slider", { name: "Hue" })).toBeTruthy();
    expect(screen.queryByRole("slider", { name: "Opacity" })).toBeNull();
  });

  it("focuses the color area when opened", async () => {
    await openPicker();
    expect(document.activeElement).toBe(
      screen.getByRole("slider", { name: "Saturation and brightness" })
    );
  });

  it("commits a valid hex on Enter and normalizes it", async () => {
    const { emitted } = await openPicker();
    const hex = screen.getByRole("textbox", { name: "Hex" });
    await fireEvent.update(hex, "#ABC");
    await fireEvent.keyDown(hex, { key: "Enter" });
    expect(emitted()["update:modelValue"]).toEqual([["#aabbcc"]]);
  });

  it("reverts an invalid hex on blur", async () => {
    const { emitted } = await openPicker();
    const hex = screen.getByRole("textbox", {
      name: "Hex",
    }) as HTMLInputElement;
    await fireEvent.update(hex, "nope");
    await fireEvent.blur(hex);
    expect(emitted()["update:modelValue"]).toBeUndefined();
    expect(hex.value).toBe("#a88bc7");
  });

  it("changes hue from the keyboard", async () => {
    const { emitted } = await openPicker({ modelValue: "#ff0000" });
    const hue = screen.getByRole("slider", { name: "Hue" });
    expect(hue.getAttribute("aria-valuenow")).toBe("0");
    await fireEvent.keyDown(hue, { key: "End" });
    await fireEvent.keyDown(hue, { key: "ArrowLeft", shiftKey: true });
    expect(hue.getAttribute("aria-valuenow")).toBe("350");
    const updates = emitted()["update:modelValue"] as string[][];
    expect(updates.at(-1)).toEqual(["#ff002b"]);
  });

  it("moves saturation and brightness with arrow keys", async () => {
    const { emitted } = await openPicker({ modelValue: "#ff0000" });
    const area = screen.getByRole("slider", {
      name: "Saturation and brightness",
    });
    await fireEvent.keyDown(area, { key: "Home" });
    expect(area.getAttribute("aria-valuetext")).toBe("0%, 100%");
    await fireEvent.keyDown(area, { key: "ArrowDown", shiftKey: true });
    expect(area.getAttribute("aria-valuetext")).toBe("0%, 90%");
    expect((emitted()["update:modelValue"] as string[][]).at(-1)).toEqual([
      "#e6e6e6",
    ]);
  });

  it("keeps the hue when moving into gray", async () => {
    await openPicker({ modelValue: "#00ff00" });
    const area = screen.getByRole("slider", {
      name: "Saturation and brightness",
    });
    const hue = screen.getByRole("slider", { name: "Hue" });
    await fireEvent.keyDown(area, { key: "Home" });
    expect(hue.getAttribute("aria-valuenow")).toBe("120");
  });

  it("emits 8-digit hex with the alpha slider", async () => {
    const { emitted } = await openPicker({
      modelValue: "#ff0000",
      alpha: true,
    });
    const alpha = screen.getByRole("slider", { name: "Opacity" });
    await fireEvent.keyDown(alpha, { key: "Home" });
    expect((emitted()["update:modelValue"] as string[][]).at(-1)).toEqual([
      "#ff000000",
    ]);
  });

  it("selects a preset swatch", async () => {
    const { emitted } = await openPicker({ swatches: ["#47A641", "#4c87e5"] });
    const swatch = screen.getByRole("button", { name: "Select #47a641" });
    await fireEvent.click(swatch);
    expect(emitted()["update:modelValue"]).toEqual([["#47a641"]]);
    expect(swatch.getAttribute("aria-pressed")).toBe("true");
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    await openPicker();
    await fireEvent.keyDown(screen.getByRole("slider", { name: "Hue" }), {
      key: "Escape",
    });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: /^Accent/ })
    );
  });

  it("includes the colour in the name when there is no label", () => {
    render(ColorPicker, { props: { modelValue: "#a88bc7" } });
    expect(
      screen.getByRole("button", { name: "Color picker #a88bc7" })
    ).toBeTruthy();
  });

  it("does not change the value when tabbing through the hex field", async () => {
    const { emitted } = await openPicker({ modelValue: null });
    const hex = screen.getByRole("textbox", { name: "Hex" });
    await fireEvent.focus(hex);
    await fireEvent.blur(hex);
    expect(emitted()["update:modelValue"]).toBeUndefined();
  });

  it("selects black when it is typed into an empty picker", async () => {
    const { emitted } = await openPicker({ modelValue: null });
    const hex = screen.getByRole("textbox", { name: "Hex" });
    await fireEvent.update(hex, "#000000");
    await fireEvent.blur(hex);
    expect(emitted()["update:modelValue"]).toEqual([["#000000"]]);
  });

  it("does not normalize an untouched value on blur", async () => {
    const { emitted } = await openPicker({ modelValue: "#ABC" });
    await fireEvent.blur(screen.getByRole("textbox", { name: "Hex" }));
    expect(emitted()["update:modelValue"]).toBeUndefined();
  });

  it("does not change the value on Escape from the hex field", async () => {
    const { emitted } = await openPicker({ modelValue: null });
    const hex = screen.getByRole("textbox", { name: "Hex" });
    hex.focus();
    await fireEvent.keyDown(hex, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(emitted()["update:modelValue"]).toBeUndefined();
  });

  it("keeps Escape from closing a surrounding popup", async () => {
    const onKeydown = vi.fn();
    renderInside("div", { onKeydown });
    const trigger = screen.getByRole("button", { name: /^Accent/ });
    await fireEvent.click(trigger);
    await fireEvent.keyDown(screen.getByRole("slider", { name: "Hue" }), {
      key: "Escape",
    });
    await fireEvent.click(trigger);
    await fireEvent.keyDown(trigger, { key: "Escape" });

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(onKeydown).not.toHaveBeenCalled();
  });

  it("closes the panel when its dialog closes", async () => {
    renderInside("dialog", { open: true });
    await fireEvent.click(screen.getByRole("button", { name: /^Accent/ }));
    expect(screen.getByRole("dialog", { name: "Color picker" })).toBeTruthy();

    const dialog = document.querySelector("dialog")!;
    await fireEvent(dialog, new Event("close"));

    expect(screen.queryByRole("dialog", { name: "Color picker" })).toBeNull();
  });

  it("does not open while disabled", async () => {
    render(ColorPicker, {
      props: { modelValue: "#a88bc7", disabled: true },
      slots: { default: "Accent" },
    });
    await fireEvent.click(screen.getByRole("button", { name: /^Accent/ }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
