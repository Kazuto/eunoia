import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/vue";
import { nextTick } from "vue";
import ActionMenu from "./ActionMenu.vue";

afterEach(cleanup);

const items = [
  { value: "edit", label: "Edit", icon: "pencil-simple" },
  {
    value: "translate",
    label: "Translate",
    hint: "Save the default text first",
    disabled: true,
  },
  {
    value: "delete",
    label: "Delete",
    variant: "danger" as const,
    divider: true,
  },
];

function renderMenu() {
  return render(ActionMenu, { props: { items, label: "Entry actions" } });
}

const trigger = () => screen.getByRole("button", { name: "Entry actions" });

describe("ActionMenu", () => {
  it("opens on click and focuses the first item", async () => {
    renderMenu();
    expect(trigger().getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("menu")).toBeNull();

    await fireEvent.click(trigger());
    await nextTick();

    const menu = screen.getByRole("menu", { name: "Entry actions" });
    expect(trigger().getAttribute("aria-expanded")).toBe("true");
    expect(trigger().getAttribute("aria-controls")).toBe(menu.id);
    expect(document.activeElement).toBe(
      screen.getByRole("menuitem", { name: /Edit/ })
    );
  });

  it("moves with the arrow keys and wraps", async () => {
    renderMenu();
    await fireEvent.keyDown(trigger(), { key: "ArrowUp" });
    await nextTick();
    const menu = screen.getByRole("menu");
    expect(document.activeElement?.textContent).toContain("Delete");

    await fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(document.activeElement?.textContent).toContain("Edit");
    // Disabled items are focusable, so their hint is read out.
    await fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(document.activeElement?.textContent).toContain("Translate");
    await fireEvent.keyDown(menu, { key: "End" });
    expect(document.activeElement?.textContent).toContain("Delete");
  });

  it("emits the value and closes", async () => {
    const { emitted } = renderMenu();
    await fireEvent.click(trigger());
    await nextTick();

    await fireEvent.click(screen.getByRole("menuitem", { name: /Delete/ }));
    await nextTick();

    expect(emitted().select).toEqual([["delete"]]);
    expect(screen.queryByRole("menu")).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  it("explains a disabled item and ignores it", async () => {
    const { emitted } = renderMenu();
    await fireEvent.click(trigger());
    await nextTick();

    const item = screen.getByRole("menuitem", { name: /Translate/ });
    expect(item.getAttribute("aria-disabled")).toBe("true");
    const hint = document.getElementById(
      item.getAttribute("aria-describedby")!
    );
    expect(hint?.textContent).toBe("Save the default text first");

    await fireEvent.click(item);
    expect(emitted().select).toBeUndefined();
    expect(screen.getByRole("menu")).toBeTruthy();
  });

  it("groups items with a separator", async () => {
    renderMenu();
    await fireEvent.click(trigger());
    await nextTick();
    expect(screen.getAllByRole("separator")).toHaveLength(1);
  });

  it("closes on Escape and returns focus to the button", async () => {
    renderMenu();
    await fireEvent.click(trigger());
    await nextTick();

    await fireEvent.keyDown(screen.getByRole("menu"), { key: "Escape" });
    await nextTick();

    expect(screen.queryByRole("menu")).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  it("closes on a click outside", async () => {
    renderMenu();
    await fireEvent.click(trigger());
    await nextTick();

    await fireEvent.mouseDown(document.body);
    await nextTick();

    expect(screen.queryByRole("menu")).toBeNull();
  });
});
