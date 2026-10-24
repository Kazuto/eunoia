import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/vue";
import Text from "./Text.vue";

afterEach(cleanup);

describe("Text", () => {
  it("renders a paragraph with no weight class by default", () => {
    render(Text, { slots: { default: "Hello" } });
    const el = screen.getByText("Hello");
    expect(el.tagName).toBe("P");
    expect(el.className).not.toMatch(/font-(normal|medium|semibold|bold)/);
  });

  it("renders the element given in as", () => {
    render(Text, { props: { as: "span" }, slots: { default: "Inline" } });
    expect(screen.getByText("Inline").tagName).toBe("SPAN");
  });

  it("applies the weight", () => {
    render(Text, { props: { weight: "semibold" }, slots: { default: "Bold" } });
    expect(screen.getByText("Bold").classList.contains("font-semibold")).toBe(
      true
    );
  });
});
