import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/vue";
import { markRaw } from "vue";
import Button from "./Button.vue";

vi.mock("@/components", () => ({
  Icon: {
    name: "Icon",
    props: ["name", "size"],
    template: '<svg data-testid="icon" />',
  },
}));

afterEach(cleanup);

describe("Button orchestrator", () => {
  it("defaults to SecondaryButton (inset shadow)", () => {
    render(Button, { slots: { default: "Default" } });
    const button = screen.getByRole("button", { name: "Default" });
    expect(button.className).toMatch(/shadow-\[inset/);
  });

  it("primary prop selects PrimaryButton", () => {
    render(Button, {
      props: { primary: true },
      slots: { default: "Primary" },
    });
    const button = screen.getByRole("button", { name: "Primary" });
    expect(button.className).toMatch(/bg-primary-500/);
  });

  it("ghost prop selects GhostButton", () => {
    render(Button, {
      props: { ghost: true },
      slots: { default: "Ghost" },
    });
    const button = screen.getByRole("button", { name: "Ghost" });
    expect(button.className).toMatch(/bg-transparent/);
    expect(button.className).not.toMatch(/shadow/);
  });

  it("destructive prop selects DestructiveButton", () => {
    render(Button, {
      props: { destructive: true },
      slots: { default: "Destructive" },
    });
    const button = screen.getByRole("button", { name: "Destructive" });
    expect(button.className).toMatch(/bg-red-500/);
  });

  it("destructive overrides primary and ghost", () => {
    render(Button, {
      props: { destructive: true, primary: true, ghost: true },
      slots: { default: "Override" },
    });
    const button = screen.getByRole("button", { name: "Override" });
    expect(button.className).toMatch(/bg-red-500/);
  });

  it.each([
    [{ primary: true }, /bg-primary-500/],
    [{ ghost: true }, /bg-transparent/],
    [{ destructive: true }, /bg-red-500/],
    [{}, /shadow-\[inset/],
  ])("renders %o as a link with its variant's look", (variant, look) => {
    render(Button, {
      props: { ...variant, href: "/docs", target: "_blank" },
      slots: { default: "Documentation" },
    });
    const link = screen.getByRole("link", { name: "Documentation" });
    expect(link.getAttribute("href")).toBe("/docs");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    expect(link.className).toMatch(look);
    // :enabled never matches a link, so hover must not depend on it.
    expect(link.className).toMatch(/not-disabled:hover:/);
    expect(link.className).not.toMatch(/(^|\s)enabled:/);
  });

  it("passes `as` and its attributes through the variants", () => {
    const RouterLink = markRaw({
      name: "RouterLink",
      props: ["to"],
      template: '<a :href="to"><slot /></a>',
    });
    render(Button, {
      props: { primary: true, as: RouterLink },
      attrs: { to: "/docs" },
      slots: { default: "Documentation" },
    });
    expect(
      screen.getByRole("link", { name: "Documentation" }).getAttribute("href")
    ).toBe("/docs");
  });
});
