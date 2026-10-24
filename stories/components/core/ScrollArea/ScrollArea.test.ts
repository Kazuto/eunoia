import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/vue";
import ScrollArea from "./ScrollArea.vue";

afterEach(cleanup);

describe("ScrollArea", () => {
  it("is reachable with the keyboard", () => {
    render(ScrollArea, { slots: { default: "Release notes" } });
    expect(screen.getByText("Release notes").getAttribute("tabindex")).toBe(
      "0"
    );
  });

  it("becomes a named region when labelled", () => {
    render(ScrollArea, {
      attrs: { "aria-label": "Release notes" },
      slots: { default: "Note 1" },
    });
    expect(screen.getByRole("region", { name: "Release notes" })).toBeTruthy();
  });

  it("has no role without a label", () => {
    render(ScrollArea, { slots: { default: "Note 1" } });
    expect(screen.getByText("Note 1").hasAttribute("role")).toBe(false);
  });
});
