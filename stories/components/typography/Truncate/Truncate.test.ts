import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/vue";
import Truncate from "./Truncate.vue";

afterEach(cleanup);

const longText =
  "A very long project title that keeps going well past the space available for it";

describe("Truncate", () => {
  it("cuts off on a single line by default", () => {
    render(Truncate, {
      props: { content: longText, maxLength: 20 },
      slots: { default: longText },
    });
    const el = screen.getByText(longText);
    expect(el.classList.contains("whitespace-nowrap")).toBe(true);
    expect(el.classList.contains("text-ellipsis")).toBe(true);
    expect(el.style.maxWidth).toBe("20ch");
    expect(el.style.getPropertyValue("-webkit-line-clamp")).toBe("");
  });

  it("clamps to the given number of lines", () => {
    render(Truncate, {
      props: { content: longText, lines: 3 },
      slots: { default: longText },
    });
    const el = screen.getByText(longText);
    expect(el.classList.contains("whitespace-nowrap")).toBe(false);
    expect(el.style.getPropertyValue("-webkit-line-clamp")).toBe("3");
    expect(el.style.display).toBe("-webkit-box");
  });

  it("treats lines=1 like the single-line default", () => {
    render(Truncate, {
      props: { content: longText, lines: 1 },
      slots: { default: longText },
    });
    expect(
      screen.getByText(longText).classList.contains("whitespace-nowrap")
    ).toBe(true);
  });
});
