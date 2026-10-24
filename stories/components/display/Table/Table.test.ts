import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/vue";
import Table from "./Table.vue";

afterEach(cleanup);

const headers = [
  { title: "Name", key: "name" },
  { title: "Email", key: "email" },
];

const items = [{ name: "Alice Johnson", email: "alice@example.com" }];

describe("Table", () => {
  it("renders a header and a row per item", () => {
    render(Table, { props: { headers, items } });
    expect(screen.getAllByRole("columnheader")).toHaveLength(2);
    expect(
      screen.getByRole("cell", { name: "alice@example.com" })
    ).toBeTruthy();
  });

  it("stacks each row with labelled values", () => {
    const { container } = render(Table, {
      props: { headers, items, stack: "always" },
    });
    expect(screen.getByRole("table").getAttribute("role")).toBe("table");
    // Every row labels its own values, so the header is only read out.
    expect(
      container.querySelector("thead")?.classList.contains("sr-only")
    ).toBe(true);

    const cells = within(screen.getAllByRole("row")[1]!).getAllByRole("cell");
    expect(cells[0]!.textContent?.trim()).toBe("Alice Johnson");
    expect(
      cells[1]!.querySelector("[aria-hidden='true']")?.textContent?.trim()
    ).toBe("Email");
  });
});
