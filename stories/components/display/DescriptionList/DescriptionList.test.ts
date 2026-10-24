import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/vue";
import DescriptionList from "./DescriptionList.vue";

afterEach(cleanup);

function rows(container: Element) {
  return [...container.querySelectorAll("dl > div")].map((row) => [
    row.querySelector("dt")?.textContent?.trim(),
    row.querySelector("dd")?.textContent?.trim(),
  ]);
}

describe("DescriptionList", () => {
  it("renders a term and description per item", () => {
    const { container } = render(DescriptionList, {
      props: {
        items: [
          { term: "Name", description: "Ada Lovelace" },
          { term: "Email", description: "ada@example.com" },
        ],
      },
    });
    expect(rows(container)).toEqual([
      ["Name", "Ada Lovelace"],
      ["Email", "ada@example.com"],
    ]);
  });

  it("keeps rows in step with items that share a term", async () => {
    const { container, rerender } = render(DescriptionList, {
      props: {
        items: [
          { term: "Phone", description: "+1 111" },
          { term: "Phone", description: "+1 222" },
          { term: "Email", description: "ada@example.com" },
        ],
      },
    });

    await rerender({
      items: [
        { term: "Email", description: "ada@example.com" },
        { term: "Phone", description: "+1 111" },
      ],
    });
    expect(rows(container)).toEqual([
      ["Email", "ada@example.com"],
      ["Phone", "+1 111"],
    ]);
  });

  it("spans the description over two columns only beside the term", async () => {
    const items = [{ term: "Name", description: "Ada Lovelace" }];
    const { container, rerender } = render(DescriptionList, {
      props: { items },
    });
    const dd = () => container.querySelector("dd")!;
    expect(dd().classList.contains("sm:col-span-2")).toBe(true);

    await rerender({ items, orientation: "vertical" });
    expect(dd().classList.contains("sm:col-span-2")).toBe(false);
  });
});
