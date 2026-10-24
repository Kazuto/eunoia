import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/vue";
import Prose from "./Prose.vue";

afterEach(cleanup);

describe("Prose", () => {
  it("wraps slot content in the prose styles", () => {
    const { container } = render(Prose, {
      slots: { default: "<h2>Title</h2><p>Body</p>" },
    });
    const root = container.firstElementChild!;
    expect(root.classList.contains("eunoia-prose")).toBe(true);
    expect(screen.getByRole("heading", { name: "Title" })).toBeTruthy();
  });

  it("renders HTML passed through v-html", () => {
    render(Prose, { attrs: { innerHTML: "<p>From Markdown</p>" } });
    expect(screen.getByText("From Markdown").tagName).toBe("P");
  });

  it("renders the requested element and size", () => {
    const { container } = render(Prose, {
      props: { as: "article", size: "lg" },
    });
    const root = container.firstElementChild!;
    expect(root.tagName).toBe("ARTICLE");
    expect(root.classList.contains("text-lg")).toBe(true);
  });
});
