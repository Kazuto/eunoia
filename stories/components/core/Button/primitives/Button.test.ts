import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/vue";
import { userEvent } from "@testing-library/user-event";
import { markRaw } from "vue";
import axe from "axe-core";
import Button from "./Button.vue";

vi.mock("@/components", () => ({
  Icon: {
    name: "Icon",
    props: ["name", "size"],
    template: '<svg data-testid="icon" />',
  },
}));

afterEach(cleanup);

describe("Button primitive", () => {
  it("renders a <button> with slot text", () => {
    render(Button, { slots: { default: "Click me" } });
    expect(screen.getByRole("button", { name: "Click me" })).toBeTruthy();
  });

  it("applies text-xs when dense", () => {
    render(Button, {
      props: { dense: true },
      slots: { default: "Dense" },
    });
    const button = screen.getByRole("button", { name: "Dense" });
    expect(button.className).toMatch(/text-xs/);
  });

  it("renders an icon when icon prop is set", () => {
    const { container } = render(Button, {
      props: { icon: "plus" },
      slots: { default: "Add" },
    });
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("applies aspect-square for icon-only (no slot content)", () => {
    render(Button, { props: { icon: "plus" } });
    const button = screen.getByRole("button");
    expect(button.className).toMatch(/aspect-square/);
  });

  it("emits click event", async () => {
    const onClick = vi.fn();
    render(Button, {
      slots: { default: "Click" },
      attrs: { onClick },
    });
    await userEvent.click(screen.getByRole("button", { name: "Click" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("emits focus event", async () => {
    const onFocus = vi.fn();
    render(Button, {
      slots: { default: "Focus" },
      attrs: { onFocus },
    });
    screen.getByRole("button", { name: "Focus" }).focus();
    expect(onFocus).toHaveBeenCalledOnce();
  });

  it("emits blur event", async () => {
    const onBlur = vi.fn();
    render(Button, {
      slots: { default: "Blur" },
      attrs: { onBlur },
    });
    const button = screen.getByRole("button", { name: "Blur" });
    button.focus();
    button.blur();
    expect(onBlur).toHaveBeenCalledOnce();
  });

  describe("as a link", () => {
    it("renders an <a> with the href instead of a <button>", () => {
      render(Button, {
        props: { href: "/docs" },
        slots: { default: "Documentation" },
      });
      const link = screen.getByRole("link", { name: "Documentation" });
      expect(link.tagName).toBe("A");
      expect(link.getAttribute("href")).toBe("/docs");
      expect(screen.queryByRole("button")).toBeNull();
    });

    it("keeps the button look", () => {
      render(Button, {
        props: { href: "/docs", dense: true, icon: "plus" },
        slots: { default: "Documentation" },
      });
      const link = screen.getByRole("link", { name: "Documentation" });
      expect(link.className).toMatch(/inline-flex/);
      expect(link.className).toMatch(/text-xs/);
      expect(link.className).toMatch(/no-underline/);
      expect(link.querySelector("svg")).not.toBeNull();
    });

    it("can be icon-only", () => {
      render(Button, {
        props: { href: "/docs", icon: "eye" },
        attrs: { "aria-label": "View" },
      });
      const link = screen.getByRole("link", { name: "View" });
      expect(link.className).toMatch(/aspect-square/);
    });

    it("protects the opener when opening a new tab", () => {
      render(Button, {
        props: { href: "https://example.com", target: "_blank" },
        slots: { default: "External" },
      });
      const link = screen.getByRole("link", { name: "External" });
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    });

    it("keeps an explicit rel", () => {
      render(Button, {
        props: { href: "https://example.com", target: "_blank", rel: "me" },
        slots: { default: "External" },
      });
      expect(screen.getByRole("link").getAttribute("rel")).toBe("me");
    });

    it("sets no rel for links in the same tab", () => {
      render(Button, {
        props: { href: "/docs" },
        slots: { default: "Documentation" },
      });
      expect(screen.getByRole("link").hasAttribute("rel")).toBe(false);
      expect(screen.getByRole("link").hasAttribute("target")).toBe(false);
    });

    it("renders the given component and passes it attributes such as `to`", () => {
      const RouterLink = markRaw({
        name: "RouterLink",
        props: ["to"],
        template: '<a :href="to" data-router-link><slot /></a>',
      });
      render(Button, {
        props: { as: RouterLink },
        attrs: { to: "/docs?page=2" },
        slots: { default: "Documentation" },
      });
      const link = screen.getByRole("link", { name: "Documentation" });
      expect(link.hasAttribute("data-router-link")).toBe(true);
      expect(link.getAttribute("href")).toBe("/docs?page=2");
    });

    it("emits click", async () => {
      const onClick = vi.fn();
      render(Button, {
        props: { href: "#section" },
        attrs: { onClick },
        slots: { default: "Jump" },
      });
      await userEvent.click(screen.getByRole("link", { name: "Jump" }));
      expect(onClick).toHaveBeenCalledOnce();
    });

    describe("when disabled", () => {
      it("leads nowhere and says it is disabled", () => {
        render(Button, {
          props: { href: "/docs", target: "_blank" },
          attrs: { disabled: true },
          slots: { default: "Documentation" },
        });
        const link = screen.getByRole("link", { name: "Documentation" });
        expect(link.hasAttribute("href")).toBe(false);
        expect(link.hasAttribute("target")).toBe(false);
        expect(link.hasAttribute("disabled")).toBe(false);
        expect(link.getAttribute("aria-disabled")).toBe("true");
        expect(link.getAttribute("tabindex")).toBe("-1");
        expect(link.className).toMatch(/aria-disabled:pointer-events-none/);
      });

      it("does not emit click", async () => {
        const onClick = vi.fn();
        render(Button, {
          props: { href: "/docs" },
          attrs: { disabled: true, onClick },
          slots: { default: "Documentation" },
        });
        const link = screen.getByRole("link", { name: "Documentation" });
        const event = new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
        });
        link.dispatchEvent(event);
        expect(onClick).not.toHaveBeenCalled();
        expect(event.defaultPrevented).toBe(true);
      });

      it("does not render the router link, which would still navigate", () => {
        const RouterLink = markRaw({
          name: "RouterLink",
          props: ["to"],
          template: '<a :href="to" data-router-link><slot /></a>',
        });
        render(Button, {
          props: { as: RouterLink },
          attrs: { to: "/docs", disabled: "" },
          slots: { default: "Documentation" },
        });
        const link = screen.getByRole("link", { name: "Documentation" });
        expect(link.hasAttribute("data-router-link")).toBe(false);
        expect(link.hasAttribute("to")).toBe(false);
        expect(link.hasAttribute("href")).toBe(false);
      });
    });

    it("keeps disabled buttons natively disabled", () => {
      render(Button, {
        attrs: { disabled: true },
        slots: { default: "Save" },
      });
      const button = screen.getByRole("button", { name: "Save" });
      expect((button as HTMLButtonElement).disabled).toBe(true);
      expect(button.hasAttribute("aria-disabled")).toBe(false);
    });

    it("has no axe violations", async () => {
      const { container } = render(Button, {
        props: { href: "/docs", target: "_blank" },
        slots: { default: "Documentation" },
      });
      const results = await axe.run(container);
      expect(results.violations).toEqual([]);
    });

    it("has no axe violations when disabled", async () => {
      const { container } = render(Button, {
        props: { href: "/docs" },
        attrs: { disabled: true },
        slots: { default: "Documentation" },
      });
      const results = await axe.run(container);
      expect(results.violations).toEqual([]);
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = render(Button, {
        slots: { default: "Accessible" },
      });
      const results = await axe.run(container);
      expect(results.violations).toEqual([]);
    });

    it("has no axe violations in dark mode", async () => {
      document.documentElement.classList.add("dark");
      const { container } = render(Button, {
        slots: { default: "Dark" },
      });
      const results = await axe.run(container);
      document.documentElement.classList.remove("dark");
      expect(results.violations).toEqual([]);
    });
  });
});
