import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/vue";
import Highlight from "./Highlight.vue";

afterEach(cleanup);

function marks(props: {
  text: string;
  query?: string | string[];
  caseSensitive?: boolean;
}) {
  const { container } = render(Highlight, { props });
  return {
    text: container.textContent,
    marked: [...container.querySelectorAll("mark")].map((m) => m.textContent),
  };
}

describe("Highlight", () => {
  it("marks every match, ignoring case by default", () => {
    const result = marks({ text: "Data tables and data views", query: "data" });
    expect(result.marked).toEqual(["Data", "data"]);
    expect(result.text).toBe("Data tables and data views");
  });

  it("respects caseSensitive", () => {
    expect(
      marks({ text: "Data and data", query: "data", caseSensitive: true })
        .marked
    ).toEqual(["data"]);
  });

  it("highlights each term of a list and prefers the longer match", () => {
    expect(
      marks({
        text: "New file in data table",
        query: ["file", "data", "data table"],
      }).marked
    ).toEqual(["file", "data table"]);
  });

  it("treats regex characters in the query literally", () => {
    expect(
      marks({ text: "Price (USD) $5.00", query: "(USD) $5." }).marked
    ).toEqual(["(USD) $5."]);
  });

  it("renders plain text for an empty query", () => {
    const result = marks({ text: "Nothing to see", query: "  " });
    expect(result.marked).toEqual([]);
    expect(result.text).toBe("Nothing to see");
  });

  it("renders matched HTML-like text as text, not markup", () => {
    const { container } = render(Highlight, {
      props: { text: "<img src=x onerror=alert(1)>", query: "img" },
    });
    expect(container.querySelector("img")).toBeNull();
    expect(container.textContent).toBe("<img src=x onerror=alert(1)>");
  });
});
