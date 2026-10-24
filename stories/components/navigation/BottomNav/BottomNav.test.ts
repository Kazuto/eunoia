import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/vue";
import { defineComponent, h } from "vue";
import BottomNav, { type BottomNavItem } from "./BottomNav.vue";

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

const items: BottomNavItem[] = [
  { label: "Home", href: "/", icon: "house" },
  { label: "Search", href: "/search", icon: "magnifying-glass" },
  { label: "Projects", href: "/projects", icon: "folder" },
  { label: "Inbox", href: "/inbox", icon: "bell" },
  { label: "Profile", href: "/profile", icon: "user" },
  { label: "Settings", href: "/settings", icon: "gear" },
];

const link = (name: string | RegExp) => screen.getByRole("link", { name });

describe("BottomNav", () => {
  it("renders a named navigation with a link per item", () => {
    render(BottomNav, { props: { items: items.slice(0, 4) } });
    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    expect(nav.querySelectorAll("a")).toHaveLength(4);
    expect(link("Search").getAttribute("href")).toBe("/search");
    expect(screen.queryByRole("button", { name: "More" })).toBeNull();
  });

  it("marks the item for the current page", () => {
    render(BottomNav, {
      props: { items: items.slice(0, 4), currentPath: "/projects" },
    });
    expect(link("Projects").getAttribute("aria-current")).toBe("page");
    expect(link("Home").getAttribute("aria-current")).toBeNull();
  });

  it("keeps a destination current on the pages below it", () => {
    render(BottomNav, {
      props: { items: items.slice(0, 4), currentPath: "/projects/42" },
    });
    expect(link("Projects").getAttribute("aria-current")).toBe("true");
    // The root only matches itself, not every page.
    expect(link("Home").getAttribute("aria-current")).toBeNull();
  });

  it("marks only the most specific matching destination", () => {
    render(BottomNav, {
      props: {
        items: [
          { label: "Projects", href: "/projects" },
          { label: "Archive", href: "/projects/archive" },
        ],
        currentPath: "/projects/archive/7",
      },
    });
    expect(link("Archive").getAttribute("aria-current")).toBe("true");
    expect(link("Projects").getAttribute("aria-current")).toBeNull();
  });

  it("moves items past `max` into a More drawer", async () => {
    render(BottomNav, { props: { items } });
    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    expect(nav.querySelectorAll("a")).toHaveLength(4);

    const more = screen.getByRole("button", { name: "More" });
    expect(more.getAttribute("aria-haspopup")).toBe("dialog");
    expect(more.getAttribute("aria-expanded")).toBe("false");

    await fireEvent.click(more);
    const drawer = screen.getByRole("dialog", { name: "More" });
    expect(more.getAttribute("aria-expanded")).toBe("true");
    expect(
      [...drawer.querySelectorAll("a")].map((a) => a.textContent?.trim())
    ).toEqual(["Profile", "Settings"]);
  });

  it("closes the More drawer when one of its links is picked", async () => {
    render(BottomNav, { props: { items } });
    await fireEvent.click(screen.getByRole("button", { name: "More" }));
    const drawer = screen.getByRole("dialog", { name: "More" });

    // A router would take over the click; jsdom can't follow the link.
    const preventNavigation = (event: Event) => event.preventDefault();
    document.addEventListener("click", preventNavigation);
    await fireEvent.click(link("Settings"));
    document.removeEventListener("click", preventNavigation);
    expect(drawer.hasAttribute("open")).toBe(false);
  });

  it("closes the More drawer when the current page changes", async () => {
    const { rerender } = render(BottomNav, {
      props: { items, currentPath: "/" },
    });
    await fireEvent.click(screen.getByRole("button", { name: "More" }));
    const drawer = screen.getByRole("dialog", { name: "More" });

    await rerender({ items, currentPath: "/settings" });
    expect(drawer.hasAttribute("open")).toBe(false);
  });

  it("marks the current page inside the More drawer", async () => {
    render(BottomNav, { props: { items, currentPath: "/settings/billing" } });
    await fireEvent.click(screen.getByRole("button", { name: "More" }));
    expect(link("Settings").getAttribute("aria-current")).toBe("page");
  });

  it("shows badges and reads them out with the label", () => {
    render(BottomNav, {
      props: {
        items: [
          { label: "Inbox", href: "/inbox", badge: 3 },
          { label: "Chat", href: "/chat", badge: 120 },
          { label: "Updates", href: "/updates", badge: true },
          { label: "Search", href: "/search", badge: 0 },
        ],
      },
    });
    expect(link("Inbox 3 new")).toBeTruthy();
    expect(link("Chat 120 new").textContent).toContain("99+");
    expect(link("Updates New")).toBeTruthy();
    expect(link("Search").textContent?.trim()).toBe("Search");
  });

  it("uses the app's link component for `to` items", () => {
    const RouterLinkStub = defineComponent({
      props: { to: { type: String, required: true } },
      setup(props, { slots }) {
        return () => h("a", { href: `#${props.to}` }, slots.default?.());
      },
    });
    render(BottomNav, {
      props: {
        items: [{ label: "Home", to: "/" }],
        currentPath: "/",
      },
      global: { provide: { eunoiaLinkComponent: RouterLinkStub } },
    });
    expect(link("Home").getAttribute("href")).toBe("#/");
    expect(link("Home").getAttribute("aria-current")).toBe("page");
  });
});
