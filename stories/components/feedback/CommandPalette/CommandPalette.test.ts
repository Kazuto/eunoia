import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { nextTick } from "vue";
import { cleanup, fireEvent, render, screen } from "@testing-library/vue";
import { isMac } from "@/composables/useShortcut";
import CommandPalette, { type CommandPaletteItem } from "./CommandPalette.vue";

// jsdom has HTMLDialogElement but neither showModal() nor close().
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    if (!this.hasAttribute("open")) return;
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
});

afterEach(cleanup);

const items: CommandPaletteItem[] = [
  { label: "New file", value: "new-file", group: "Files" },
  { label: "Save all", value: "save-all", group: "Files", disabled: true },
  { label: "Open recent", value: "open-recent", group: "Files" },
  {
    label: "Toggle theme",
    value: "toggle-theme",
    group: "Preferences",
    keywords: ["dark mode"],
  },
  { label: "Help", value: "help" },
];

function activeOption() {
  const id = screen.getByRole("combobox").getAttribute("aria-activedescendant");
  return id ? document.getElementById(id) : null;
}

describe("CommandPalette", () => {
  it("opens from its keyboard shortcut", async () => {
    const { emitted } = render(CommandPalette, { props: { items } });
    expect(screen.queryByRole("dialog")).toBeNull();

    await fireEvent.keyDown(
      window,
      isMac() ? { key: "k", metaKey: true } : { key: "k", ctrlKey: true }
    );

    expect(emitted()["update:open"]).toEqual([[true]]);
    expect(
      screen.getByRole("dialog", { name: "Command palette" })
    ).toBeTruthy();
  });

  it("focuses the search field when opened", async () => {
    render(CommandPalette, { props: { items, open: true } });
    await nextTick();
    expect(document.activeElement).toBe(screen.getByRole("combobox"));
  });

  it("groups items under their headings", () => {
    render(CommandPalette, { props: { items, open: true } });
    const files = screen.getByRole("group", { name: "Files" });
    expect(files.querySelectorAll('[role="option"]')).toHaveLength(3);
    expect(screen.getByRole("group", { name: "Preferences" })).toBeTruthy();
    expect(screen.getAllByRole("option")).toHaveLength(5);
  });

  it("filters by label and keywords and says when nothing matches", async () => {
    render(CommandPalette, { props: { items, open: true } });
    const input = screen.getByRole("combobox");

    await fireEvent.update(input, "dark");
    expect(
      screen.getAllByRole("option").map((o) => o.textContent?.trim())
    ).toEqual(["Toggle theme"]);
    expect(activeOption()?.textContent?.trim()).toBe("Toggle theme");

    await fireEvent.update(input, "nothing like this");
    expect(screen.queryAllByRole("option")).toHaveLength(0);
    expect(screen.getByText("No results found")).toBeTruthy();
  });

  it("moves through enabled options with the arrow, Home and End keys", async () => {
    render(CommandPalette, { props: { items, open: true } });
    const input = screen.getByRole("combobox");
    expect(activeOption()?.textContent?.trim()).toBe("New file");
    expect(activeOption()?.getAttribute("aria-selected")).toBe("true");

    await fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(activeOption()?.textContent?.trim()).toBe("Open recent");

    await fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(activeOption()?.textContent?.trim()).toBe("New file");

    await fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(activeOption()?.textContent?.trim()).toBe("Help");

    await fireEvent.keyDown(input, { key: "Home" });
    expect(activeOption()?.textContent?.trim()).toBe("New file");

    await fireEvent.keyDown(input, { key: "End" });
    expect(activeOption()?.textContent?.trim()).toBe("Help");
  });

  it("selects the active option with Enter and closes", async () => {
    const { emitted } = render(CommandPalette, {
      props: { items, open: true },
    });
    const input = screen.getByRole("combobox");

    await fireEvent.keyDown(input, { key: "ArrowDown" });
    await fireEvent.keyDown(input, { key: "Enter" });

    expect(emitted().select).toEqual([["open-recent"]]);
    expect(emitted()["update:open"]).toEqual([[false]]);
  });

  it("selects on click but ignores disabled options", async () => {
    const { emitted } = render(CommandPalette, {
      props: { items, open: true },
    });

    await fireEvent.click(screen.getByRole("option", { name: "Save all" }));
    expect(emitted().select).toBeUndefined();

    await fireEvent.click(screen.getByRole("option", { name: "Help" }));
    expect(emitted().select).toEqual([["help"]]);
  });

  it("closes with Escape without selecting", async () => {
    const { emitted } = render(CommandPalette, {
      props: { items, open: true },
    });

    await fireEvent.keyDown(screen.getByRole("combobox"), { key: "Escape" });

    expect(emitted()["update:open"]).toEqual([[false]]);
    expect(emitted().select).toBeUndefined();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes on a backdrop click", async () => {
    const { emitted } = render(CommandPalette, {
      props: { items, open: true },
    });

    await fireEvent.click(screen.getByRole("dialog"));

    expect(emitted()["update:open"]).toEqual([[false]]);
  });

  it("resets the search each time it opens", async () => {
    const { rerender } = render(CommandPalette, {
      props: { items, open: true },
    });
    await fireEvent.update(screen.getByRole("combobox"), "help");

    await rerender({ items, open: false });
    await rerender({ items, open: true });

    expect((screen.getByRole("combobox") as HTMLInputElement).value).toBe("");
    expect(screen.getAllByRole("option")).toHaveLength(5);
  });
});
