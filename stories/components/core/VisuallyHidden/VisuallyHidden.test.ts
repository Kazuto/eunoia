import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/vue";
import VisuallyHidden from "./VisuallyHidden.vue";

afterEach(cleanup);

describe("VisuallyHidden", () => {
  it("hides its content visually only", () => {
    render(VisuallyHidden, { slots: { default: "Delete project" } });
    const el = screen.getByText("Delete project");
    expect(el.tagName).toBe("SPAN");
    expect(el.classList.contains("sr-only")).toBe(true);
    expect(el.classList.contains("focus-within:not-sr-only")).toBe(false);
  });

  it("shows focusable content once it has focus", () => {
    render(VisuallyHidden, {
      props: { focusable: true },
      slots: { default: '<a href="#main">Skip to content</a>' },
    });
    const wrapper = screen.getByRole("link").parentElement!;
    expect(wrapper.classList.contains("sr-only")).toBe(true);
    expect(wrapper.classList.contains("focus-within:not-sr-only")).toBe(true);
  });

  it("renders the given element", () => {
    render(VisuallyHidden, {
      props: { as: "h2" },
      slots: { default: "Recent activity" },
    });
    expect(
      screen.getByRole("heading", { level: 2, name: "Recent activity" })
    ).toBeTruthy();
  });
});
