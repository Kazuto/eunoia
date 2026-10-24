import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/vue";
import Dropzone from "./Dropzone.vue";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("Dropzone", () => {
  it("keeps its file input reachable by keyboard, under its label", () => {
    render(Dropzone, { slots: { default: "Attachment" } });
    const input = screen.getByLabelText("Attachment");
    expect(input.getAttribute("type")).toBe("file");
    // Visually hidden rather than `display: none`, which would drop it from the tab order.
    expect(input.classList.contains("sr-only")).toBe(true);
    expect(input.classList.contains("hidden")).toBe(false);
  });

  it("opens the picker once, whether the zone or the input is clicked", async () => {
    const click = vi.spyOn(HTMLInputElement.prototype, "click");
    render(Dropzone, { slots: { default: "Attachment" } });
    const input = screen.getByLabelText<HTMLInputElement>("Attachment");

    await fireEvent.click(input.parentElement!);
    expect(click).toHaveBeenCalledOnce();

    // The input's own click, as Enter or Space sends it, already opens the picker.
    click.mockClear();
    await fireEvent.click(input);
    expect(click).not.toHaveBeenCalled();
  });

  it("takes a dropped file", async () => {
    const file = new File(["hello"], "notes.txt", { type: "text/plain" });
    const { emitted } = render(Dropzone);
    await fireEvent.drop(screen.getByText(/drop/i).closest("div.relative")!, {
      dataTransfer: { files: [file] },
    });
    expect(emitted("update:modelValue")?.[0]).toEqual([file]);
  });
});
