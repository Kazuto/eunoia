import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/vue";
import Rating from "./Rating.vue";

afterEach(cleanup);

describe("Rating", () => {
  it("renders a labelled radiogroup with one named radio per star", () => {
    render(Rating, { slots: { default: "Your rating" } });
    const group = screen.getByRole("radiogroup", { name: "Your rating" });
    expect(group).toBeTruthy();
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(5);
    expect(screen.getByRole("radio", { name: "3 of 5" })).toBeTruthy();
  });

  it("falls back to the locale label without a slot", () => {
    render(Rating);
    expect(screen.getByRole("radiogroup", { name: "Rating" })).toBeTruthy();
  });

  it("selects a value on click", async () => {
    const { emitted } = render(Rating, { props: { modelValue: null } });
    await fireEvent.click(screen.getByRole("radio", { name: "4 of 5" }));
    expect(emitted()["update:modelValue"]).toEqual([[4]]);
    expect(emitted().change).toEqual([[4]]);
  });

  it("keeps a single tab stop on the checked radio", () => {
    render(Rating, { props: { modelValue: 2 } });
    const tabbable = screen
      .getAllByRole("radio")
      .filter((radio) => radio.getAttribute("tabindex") === "0");
    expect(tabbable).toHaveLength(1);
    expect(tabbable[0].getAttribute("aria-label")).toBe("2 of 5");
    expect(tabbable[0].getAttribute("aria-checked")).toBe("true");
  });

  it("moves and clamps with arrow keys, Home and End", async () => {
    const { emitted } = render(Rating, { props: { modelValue: 2 } });
    const current = screen.getByRole("radio", { name: "2 of 5" });

    await fireEvent.keyDown(current, { key: "ArrowRight" });
    await fireEvent.keyDown(current, { key: "ArrowLeft" });
    await fireEvent.keyDown(current, { key: "End" });
    expect(document.activeElement).toBe(
      screen.getByRole("radio", { name: "5 of 5" })
    );
    await fireEvent.keyDown(current, { key: "Home" });
    await fireEvent.keyDown(screen.getByRole("radio", { name: "1 of 5" }), {
      key: "ArrowLeft",
    });

    expect(emitted()["update:modelValue"]).toEqual([[3], [1], [5], [1]]);
    expect(emitted().change).toEqual([[3], [1], [5], [1]]);
  });

  it("offers half steps when allowHalf is set", async () => {
    const { emitted } = render(Rating, {
      props: { modelValue: null, allowHalf: true, max: 3 },
    });
    expect(screen.getAllByRole("radio")).toHaveLength(6);
    await fireEvent.click(screen.getByRole("radio", { name: "2.5 of 3" }));
    expect(emitted()["update:modelValue"]).toEqual([[2.5]]);
  });

  it("ignores input while disabled", async () => {
    const { emitted } = render(Rating, {
      props: { modelValue: 1, disabled: true },
    });
    const radio = screen.getByRole("radio", { name: "3 of 5" });
    await fireEvent.click(radio);
    await fireEvent.keyDown(radio, { key: "ArrowRight" });
    expect(emitted()["update:modelValue"]).toBeUndefined();
    expect(
      screen
        .getAllByRole("radio")
        .every((r) => r.getAttribute("tabindex") === "-1")
    ).toBe(true);
  });

  it("renders a static image when readonly", () => {
    render(Rating, { props: { modelValue: 3.5, readonly: true } });
    expect(screen.queryByRole("radiogroup")).toBeNull();
    expect(screen.getByRole("img", { name: "3.5 of 5" })).toBeTruthy();
  });
});
