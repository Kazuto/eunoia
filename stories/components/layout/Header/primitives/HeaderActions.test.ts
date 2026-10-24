import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/vue";
import { nextTick } from "vue";
import HeaderActions from "./HeaderActions.vue";

const onImport = vi.fn();
const onExport = vi.fn();
const onCreate = vi.fn();
const onArchive = vi.fn();

const actions = [
  { content: "Import", icon: "upload", onClick: onImport },
  { content: "Export", icon: "download", onClick: onExport },
];
const primaryAction = { content: "Create", icon: "plus", onClick: onCreate };

let rowWidth = 0;
let resize: (() => void) | undefined;
const row = document.createElement("div");

beforeEach(() => {
  // jsdom has no layout: buttons with text are 100px wide, icon-only ones 36px.
  vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(
    function (this: HTMLElement) {
      return this.textContent?.trim() ? 100 : 36;
    }
  );
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    function (this: HTMLElement) {
      return { width: this === row ? rowWidth : 0 } as DOMRect;
    }
  );
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(callback: (entries: { target: Element }[]) => void) {
        resize = () => callback([{ target: row }]);
      }
      observe() {}
      disconnect() {}
    }
  );
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
  resize = undefined;
});

async function renderAt(width: number, props: Record<string, unknown> = {}) {
  rowWidth = width;
  const result = render(HeaderActions, {
    props: { actions, primaryAction, row, ...props },
  });
  await nextTick();
  return result;
}

/** The buttons outside the measuring copies and the menu. */
function shown() {
  return screen
    .getAllByRole("button")
    .map((button) => button.textContent?.trim() || button.ariaLabel);
}

async function openMenu() {
  await fireEvent.click(screen.getByRole("button", { name: "More actions" }));
  return screen
    .getAllByRole("menuitem")
    .map((item) => item.textContent?.trim());
}

describe("HeaderActions", () => {
  it("shows every action when there's room", async () => {
    await renderAt(1000);
    expect(shown()).toEqual(["Import", "Export", "Create"]);
  });

  it("shows everything before it's laid out", async () => {
    await renderAt(0);
    expect(shown()).toEqual(["Import", "Export", "Create"]);
  });

  it("moves the last actions into the menu first", async () => {
    // Import, Create and the menu: 100 + 100 + 36 + 2 gaps of 8
    await renderAt(252);
    expect(shown()).toEqual(["Import", "Create", "More actions"]);
    expect(await openMenu()).toEqual(["Export"]);
  });

  it("shrinks the primary action to its icon, then moves it into the menu", async () => {
    await renderAt(80);
    expect(shown()).toEqual(["Create", "More actions"]);
    expect(screen.getByRole("button", { name: "Create" }).textContent).toBe("");
    expect(await openMenu()).toEqual(["Import", "Export"]);
    cleanup();

    await renderAt(40);
    expect(shown()).toEqual(["More actions"]);
    expect(await openMenu()).toEqual(["Create", "Import", "Export"]);
  });

  it("skips the icon step when the primary action has no icon", async () => {
    await renderAt(80, { primaryAction: { content: "Create" } });
    expect(shown()).toEqual(["More actions"]);
  });

  it("keeps secondary actions in the menu, below the moved ones", async () => {
    // The menu is always there, so Import no longer fits next to it.
    await renderAt(240, {
      secondaryActions: [{ content: "Archive", onClick: onArchive }],
    });
    expect(shown()).toEqual(["Create", "More actions"]);
    expect(await openMenu()).toEqual(["Import", "Export", "Archive"]);
    expect(screen.getAllByRole("separator")).toHaveLength(1);
  });

  it("runs the action picked from the menu", async () => {
    await renderAt(40);
    await openMenu();
    await fireEvent.click(screen.getByRole("menuitem", { name: "Export" }));
    expect(onExport).toHaveBeenCalledOnce();
    expect(onCreate).not.toHaveBeenCalled();
  });

  it("brings actions back when the row grows", async () => {
    vi.stubGlobal("requestAnimationFrame", (callback: () => void) => {
      callback();
      return 0;
    });
    await renderAt(40);
    rowWidth = 1000;
    resize?.();
    await nextTick();
    expect(shown()).toEqual(["Import", "Export", "Create"]);
  });
});
