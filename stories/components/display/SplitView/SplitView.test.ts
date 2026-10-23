import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/vue";
import { nextTick } from "vue";
import SplitView from "./SplitView.vue";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const items = Array.from({ length: 1000 }, (_, index) => ({
  key: index,
  label: `Item ${index}`,
}));

function scrollerOf(container: Element) {
  return container.querySelector("ul")!.parentElement!;
}

function setScrollMetrics(
  element: HTMLElement,
  metrics: { scrollHeight: number; clientHeight: number; scrollTop: number }
) {
  for (const [key, value] of Object.entries(metrics)) {
    Object.defineProperty(element, key, { configurable: true, value });
  }
}

describe("SplitView endReached", () => {
  it("emits when scrolled near the end and more items exist", async () => {
    const { container, emitted } = render(SplitView, {
      props: { items: items.slice(0, 20), hasMore: true },
    });
    const scroller = scrollerOf(container);
    setScrollMetrics(scroller, {
      scrollHeight: 2000,
      clientHeight: 400,
      scrollTop: 0,
    });
    await fireEvent.scroll(scroller);
    expect(emitted().endReached).toBeUndefined();

    setScrollMetrics(scroller, {
      scrollHeight: 2000,
      clientHeight: 400,
      scrollTop: 1450,
    });
    await fireEvent.scroll(scroller);
    expect(emitted().endReached).toHaveLength(1);
  });

  it("stays quiet while loading or when nothing is left", async () => {
    const { container, emitted, rerender } = render(SplitView, {
      props: { items: items.slice(0, 20), hasMore: true, loading: true },
    });
    const scroller = scrollerOf(container);
    setScrollMetrics(scroller, {
      scrollHeight: 400,
      clientHeight: 400,
      scrollTop: 0,
    });
    await fireEvent.scroll(scroller);
    await rerender({ items: items.slice(0, 20), hasMore: false });
    await fireEvent.scroll(scroller);
    expect(emitted().endReached).toBeUndefined();
  });
});

describe("SplitView search", () => {
  it("pins the search field when stickySearch is set", () => {
    const { container } = render(SplitView, {
      props: { items: [], searchable: true, stickySearch: true },
    });
    const field = screen.getByRole("searchbox");
    expect(container.querySelector(".sticky")?.contains(field)).toBe(true);
  });

  it("leaves the search field in the flow by default", () => {
    const { container } = render(SplitView, {
      props: { items: [], searchable: true },
    });
    screen.getByRole("searchbox");
    expect(container.querySelector(".sticky")).toBeNull();
  });
});

describe("SplitView virtual", () => {
  it("renders only the rows in view and announces their position", async () => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      width: 250,
      height: 360,
      top: 0,
      left: 0,
      right: 250,
      bottom: 360,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(360);
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(250);

    render(SplitView, {
      props: { items, virtual: true, itemSize: 36, total: 5000 },
    });
    await nextTick();
    await nextTick();

    const rows = screen.getAllByRole("listitem");
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.length).toBeLessThan(100);
    expect(rows[0]?.getAttribute("aria-posinset")).toBe("1");
    expect(rows[0]?.getAttribute("aria-setsize")).toBe("5000");
    // Placed with `top`, as Firefox anchors a row's tooltips as if it had no transform.
    expect(rows[0]?.style.top).toBe("0px");
    expect(rows[1]?.style.top).toMatch(/^[1-9]\d*px$/);
    expect(rows[1]?.style.transform).toBe("");
  });
});

describe("SplitView search", () => {
  it("labels the search field and focuses it with the search shortcut", async () => {
    render(SplitView, {
      props: {
        items: items.slice(0, 5),
        searchable: true,
        searchShortcut: "/",
      },
      attachTo: document.body,
    });
    const search = screen.getByRole("searchbox", { name: "Search…" });
    expect(search.getAttribute("aria-keyshortcuts")).toBe("/");
    expect(document.querySelector("kbd")?.textContent).toBe("/");

    await fireEvent.keyDown(window, { key: "/" });
    expect(document.activeElement).toBe(search);
  });
});

describe("SplitView selectable", () => {
  function checkbox(label: string) {
    return screen.getByRole("checkbox", { name: `Select ${label}` });
  }

  it("checks rows without selecting them", async () => {
    const { emitted } = render(SplitView, {
      props: { items: items.slice(0, 5), selectable: true },
    });
    await fireEvent.click(checkbox("Item 1"));
    expect(emitted()["update:selection"]).toEqual([[[1]]]);
    expect(emitted().select).toBeUndefined();
  });

  it("extends from the last checked row with shift", async () => {
    const { emitted, rerender } = render(SplitView, {
      props: { items: items.slice(0, 6), selectable: true, selection: [] },
    });
    await fireEvent.click(checkbox("Item 1"));
    await rerender({ selection: [1] });
    await fireEvent.pointerDown(checkbox("Item 4"), { shiftKey: true });
    await fireEvent.click(checkbox("Item 4"));
    expect(emitted()["update:selection"]?.at(-1)).toEqual([[1, 2, 3, 4]]);

    await rerender({ selection: [1, 2, 3, 4] });
    await fireEvent.pointerDown(checkbox("Item 2"), { shiftKey: true });
    await fireEvent.click(checkbox("Item 2"));
    expect(emitted()["update:selection"]?.at(-1)).toEqual([[1]]);
  });

  it("renders no checkboxes by default", () => {
    render(SplitView, { props: { items: items.slice(0, 5) } });
    expect(screen.queryAllByRole("checkbox")).toHaveLength(0);
  });
});
