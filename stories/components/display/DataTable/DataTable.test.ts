import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/vue";
import { nextTick } from "vue";
import DataTable from "./DataTable.vue";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const columns = [
  { title: "Name", key: "name", sortable: true },
  { title: "Role", key: "role" },
  { title: "Hours", key: "hours", sortable: true, align: "end" as const },
];

const items = [
  { name: "Bob Smith", role: "Designer", hours: 152 },
  { name: "Alice Johnson", role: "Engineer", hours: 160 },
];

const names = () =>
  screen
    .getAllByRole("row")
    .slice(1)
    .map((row) => within(row).getAllByRole("cell")[0]?.textContent?.trim());

describe("DataTable", () => {
  it("sorts with buttons in the column headers", async () => {
    render(DataTable, { props: { columns, items } });
    const sortByName = screen.getByRole("button", { name: "Name" });
    expect(screen.queryByRole("button", { name: "Role" })).toBeNull();

    await fireEvent.click(sortByName);
    expect(names()).toEqual(["Alice Johnson", "Bob Smith"]);
    expect(
      screen
        .getByRole("columnheader", { name: "Name" })
        .getAttribute("aria-sort")
    ).toBe("ascending");

    await fireEvent.click(sortByName);
    expect(names()).toEqual(["Bob Smith", "Alice Johnson"]);
  });

  it("puts `class` on the wrapper and other attributes on the table", () => {
    const { container } = render(DataTable, {
      props: { columns, items },
      attrs: { class: "mt-4", "aria-label": "Team" },
    });
    expect(container.firstElementChild?.classList.contains("mt-4")).toBe(true);
    expect(screen.getByRole("table", { name: "Team" })).toBeTruthy();
  });

  describe("stacked", () => {
    it("labels each value and keeps the table roles", () => {
      render(DataTable, {
        props: { columns, items, stack: "always" },
        slots: { actions: "<button>Edit</button>" },
      });
      const table = screen.getByRole("table");
      expect(table.getAttribute("role")).toBe("table");

      const row = screen.getAllByRole("row")[1]!;
      const cells = within(row).getAllByRole("cell");
      // The title cell has no label; the others show theirs, hidden from screen readers.
      expect(cells[0]!.textContent?.trim()).toBe("Bob Smith");
      const label = cells[1]!.querySelector("[aria-hidden='true']");
      expect(label?.textContent?.trim()).toBe("Role");
      expect(
        within(cells[3]!).getByRole("button", { name: "Edit" })
      ).toBeTruthy();
    });

    it("keeps only the sortable headers visible", () => {
      render(DataTable, {
        props: { columns, items, stack: "always" },
        slots: { actions: "<button>Edit</button>" },
      });
      const headers = screen.getAllByRole("columnheader");
      const hidden = headers.map((th) => th.classList.contains("sr-only"));
      expect(hidden).toEqual([false, true, false, true]);
      expect(screen.getByRole("button", { name: "Hours" })).toBeTruthy();
    });

    it("hides the header row when nothing is sortable", () => {
      const { container } = render(DataTable, {
        props: {
          columns: [
            { title: "Name", key: "name" },
            { title: "Role", key: "role" },
          ],
          items,
          stack: "always",
        },
      });
      expect(
        container.querySelector("thead")?.classList.contains("sr-only")
      ).toBe(true);
    });

    it("stacks on its own when the columns don't fit", async () => {
      // jsdom has no layout: the table is 600px wide side by side, the space 400px.
      vi.spyOn(
        HTMLElement.prototype,
        "getBoundingClientRect"
      ).mockImplementation(function (this: HTMLElement) {
        const width =
          this.tagName === "TABLE" && this.getAttribute("role") !== "table"
            ? 600
            : 400;
        return { width } as DOMRect;
      });
      render(DataTable, { props: { columns, items } });
      await nextTick();
      await nextTick();
      expect(screen.getByRole("table").getAttribute("role")).toBe("table");
    });

    it("stays a table when the columns fit", async () => {
      vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
        width: 400,
      } as DOMRect);
      render(DataTable, { props: { columns, items } });
      await nextTick();
      await nextTick();
      expect(screen.getByRole("table").getAttribute("role")).toBeNull();
    });

    it('never stacks with `stack: "never"`', async () => {
      vi.spyOn(
        HTMLElement.prototype,
        "getBoundingClientRect"
      ).mockImplementation(function (this: HTMLElement) {
        return { width: this.tagName === "TABLE" ? 600 : 400 } as DOMRect;
      });
      render(DataTable, { props: { columns, items, stack: "never" } });
      await nextTick();
      await nextTick();
      expect(screen.getByRole("table").getAttribute("role")).toBeNull();
    });
  });
});
