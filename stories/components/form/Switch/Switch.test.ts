import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/vue";
import Switch from "./Switch.vue";

afterEach(cleanup);

describe("Switch", () => {
  it("is named by its label and visible to assistive tech", () => {
    render(Switch, { slots: { default: "Only mine" } });
    const control = screen.getByRole("switch", { name: "Only mine" });
    expect(control.closest('[aria-hidden="true"]')).toBeNull();
    expect(screen.getByText("Only mine")).toBeTruthy();
  });

  it("toggles once when the label or the track is clicked", async () => {
    const { emitted, container } = render(Switch, {
      props: { modelValue: false },
      slots: { default: "Only mine" },
    });
    await fireEvent.click(screen.getByText("Only mine"));
    expect(emitted()["update:modelValue"]).toEqual([[true]]);
    expect(emitted().change).toEqual([[true]]);

    await fireEvent.click(container.querySelector("label > div")!);
    expect(emitted()["update:modelValue"]).toHaveLength(2);
  });

  it("does not toggle while disabled", async () => {
    const { emitted } = render(Switch, {
      props: { modelValue: false, disabled: true },
      slots: { default: "Only mine" },
    });
    await fireEvent.click(screen.getByText("Only mine"));
    expect(emitted()["update:modelValue"]).toBeUndefined();
  });
});
