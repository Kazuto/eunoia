import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/vue";
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
});
