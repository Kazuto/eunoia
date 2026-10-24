import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/vue";
import { nextTick } from "vue";
import ContextMenu from "./ContextMenu.vue";

beforeAll(() => {
  // jsdom has no layout, so it lacks scrollIntoView.
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(cleanup);

const items = [
  { value: "open", label: "Open" },
  { value: "share", label: "Share", disabled: true },
  { value: "rename", label: "Rename" },
  {
    value: "delete",
    label: "Delete",
    variant: "danger" as const,
    divider: true,
  },
];

function renderMenu(props: Record<string, unknown> = {}) {
  return render(ContextMenu, {
    props: { items, label: "File actions", ...props },
    slots: { default: "report.pdf" },
  });
}

const region = () => screen.getByText("report.pdf");

function rightClick(target: Element) {
  const event = new MouseEvent("contextmenu", {
    bubbles: true,
    cancelable: true,
    clientX: 40,
    clientY: 60,
  });
  target.dispatchEvent(event);
  return event;
}

function activeItem() {
  const menu = screen.getByRole("menu");
  const id = menu.getAttribute("aria-activedescendant");
  return id ? document.getElementById(id) : null;
}

describe("ContextMenu", () => {
  it("replaces the browser menu on right-click", async () => {
    renderMenu();
    expect(screen.queryByRole("menu")).toBeNull();

    const event = rightClick(region());
    await nextTick();
    await nextTick();

    expect(event.defaultPrevented).toBe(true);
    const menu = screen.getByRole("menu", { name: "File actions" });
    expect(document.activeElement).toBe(menu);
    expect(menu.getAttribute("aria-activedescendant")).toBeNull();
    expect(screen.getAllByRole("menuitem")).toHaveLength(4);
    expect(screen.getByRole("separator")).toBeTruthy();
  });

  it("opens from the keyboard with the first item active", async () => {
    renderMenu();
    await fireEvent.keyDown(region(), { key: "F10", shiftKey: true });
    await nextTick();

    expect(activeItem()?.textContent).toContain("Open");
  });

  it("skips disabled items and wraps with the arrow keys", async () => {
    renderMenu();
    await fireEvent.keyDown(region(), { key: "ContextMenu" });
    await nextTick();
    const menu = screen.getByRole("menu");

    await fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(activeItem()?.textContent).toContain("Rename");
    await fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(activeItem()?.textContent).toContain("Delete");
    await fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(activeItem()?.textContent).toContain("Open");
    await fireEvent.keyDown(menu, { key: "ArrowUp" });
    expect(activeItem()?.textContent).toContain("Delete");
    await fireEvent.keyDown(menu, { key: "Home" });
    expect(activeItem()?.textContent).toContain("Open");
  });

  it("emits the active item on Enter and returns focus", async () => {
    const { emitted } = renderMenu();
    region().focus();
    await fireEvent.keyDown(region(), { key: "F10", shiftKey: true });
    await nextTick();
    const menu = screen.getByRole("menu");

    await fireEvent.keyDown(menu, { key: "End" });
    await fireEvent.keyDown(menu, { key: "Enter" });
    await nextTick();

    expect(emitted().select).toEqual([["delete"]]);
    expect(screen.queryByRole("menu")).toBeNull();
    expect(document.activeElement).toBe(region());
  });

  it("emits a clicked item and ignores disabled ones", async () => {
    const { emitted } = renderMenu();
    rightClick(region());
    await nextTick();

    await fireEvent.click(screen.getByRole("menuitem", { name: "Share" }));
    expect(emitted().select).toBeUndefined();
    expect(screen.getByRole("menu")).toBeTruthy();

    await fireEvent.click(screen.getByRole("menuitem", { name: "Rename" }));
    await nextTick();
    expect(emitted().select).toEqual([["rename"]]);
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("closes on Escape without letting a surrounding dialog see it", async () => {
    renderMenu();
    rightClick(region());
    await nextTick();
    const menu = screen.getByRole("menu");
    const outer = vi.fn();
    document.addEventListener("keydown", outer);

    await fireEvent.keyDown(menu, { key: "Escape" });
    await nextTick();

    document.removeEventListener("keydown", outer);
    expect(screen.queryByRole("menu")).toBeNull();
    expect(outer).not.toHaveBeenCalled();
  });

  it("closes on a click outside", async () => {
    renderMenu();
    rightClick(region());
    await nextTick();

    await fireEvent.mouseDown(document.body);
    await nextTick();
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("leaves the browser menu alone while disabled", async () => {
    renderMenu({ disabled: true });
    const event = rightClick(region());
    await nextTick();

    expect(event.defaultPrevented).toBe(false);
    expect(screen.queryByRole("menu")).toBeNull();
  });
});
