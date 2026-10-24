import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/vue";
import Combobox from "./Combobox.vue";

vi.mock("@/components", () => ({
  Icon: { template: "<svg />" },
}));

afterEach(cleanup);

const options = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Pineapple", value: "pineapple" },
];

function renderCombobox(props: Record<string, unknown> = {}) {
  return render(Combobox, {
    props: { options, ...props },
    slots: { default: "Fruit" },
  });
}

describe("Combobox", () => {
  it("is named by its label and filters options case-insensitively while typing", async () => {
    renderCombobox();
    const input = screen.getByRole("combobox", { name: "Fruit" });
    expect(input.getAttribute("aria-expanded")).toBe("false");

    await fireEvent.update(input, "APP");

    expect(input.getAttribute("aria-expanded")).toBe("true");
    expect(input.getAttribute("aria-controls")).toBe(
      screen.getByRole("listbox").id
    );
    const names = screen.getAllByRole("option").map((o) => o.textContent);
    expect(names.map((n) => n?.trim())).toEqual(["Apple", "Pineapple"]);
  });

  it("shows a no-results row when nothing matches", async () => {
    renderCombobox();
    await fireEvent.update(screen.getByRole("combobox"), "kiwi");
    expect(screen.getByRole("option").textContent?.trim()).toBe("No results");
  });

  it("selects the active option with the keyboard", async () => {
    const { emitted } = renderCombobox();
    const input = screen.getByRole("combobox");

    await fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input.getAttribute("aria-activedescendant")).toBe(
      screen.getAllByRole("option")[0].id
    );
    await fireEvent.keyDown(input, { key: "ArrowDown" });
    await fireEvent.keyDown(input, { key: "Enter" });

    expect(emitted()["update:modelValue"]).toEqual([["banana"]]);
    expect(screen.queryByRole("listbox")).toBeNull();
    expect((input as HTMLInputElement).value).toBe("Banana");
  });

  it("jumps to the first and last option with Home and End", async () => {
    renderCombobox();
    const input = screen.getByRole("combobox");
    await fireEvent.keyDown(input, { key: "ArrowDown" });

    await fireEvent.keyDown(input, { key: "End" });
    expect(input.getAttribute("aria-activedescendant")).toBe(
      screen.getAllByRole("option")[2].id
    );
    await fireEvent.keyDown(input, { key: "Home" });
    expect(input.getAttribute("aria-activedescendant")).toBe(
      screen.getAllByRole("option")[0].id
    );
  });

  it("selects an option on click", async () => {
    const { emitted } = renderCombobox();
    await fireEvent.update(screen.getByRole("combobox"), "pine");
    await fireEvent.click(screen.getByRole("option", { name: "Pineapple" }));
    expect(emitted()["update:modelValue"]).toEqual([["pineapple"]]);
  });

  it("closes on Escape and restores the selected label", async () => {
    renderCombobox({ modelValue: "apple" });
    const input = screen.getByRole("combobox") as HTMLInputElement;
    expect(input.value).toBe("Apple");

    await fireEvent.update(input, "ban");
    await fireEvent.keyDown(input, { key: "Escape" });

    expect(screen.queryByRole("listbox")).toBeNull();
    expect(input.value).toBe("Apple");
  });

  it("clears the selection and the text", async () => {
    const { emitted } = renderCombobox({ modelValue: "apple" });
    await fireEvent.click(
      screen.getByRole("button", { name: "Clear selection" })
    );
    expect(emitted()["update:modelValue"]).toEqual([[null]]);
    expect((screen.getByRole("combobox") as HTMLInputElement).value).toBe("");
  });

  it("does not open or offer clearing while disabled", async () => {
    renderCombobox({ modelValue: "apple", disabled: true });
    const input = screen.getByRole("combobox");
    expect((input as HTMLInputElement).disabled).toBe(true);
    await fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(
      screen.queryByRole("button", { name: "Clear selection" })
    ).toBeNull();
  });

  it("closes when clicking outside", async () => {
    renderCombobox();
    await fireEvent.update(screen.getByRole("combobox"), "a");
    expect(screen.getByRole("listbox")).toBeTruthy();
    await fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("listbox")).toBeNull();
  });
});
