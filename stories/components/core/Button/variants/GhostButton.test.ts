import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/vue";
import axe from "axe-core";
import GhostButton from "./GhostButton.vue";

vi.mock("@/components", () => ({
  Icon: {
    name: "Icon",
    props: ["name", "size"],
    template: '<svg data-testid="icon" />',
  },
}));

afterEach(cleanup);

describe("GhostButton", () => {
  it("renders with transparent bg and no shadow", () => {
    render(GhostButton, { slots: { default: "Ghost" } });
    const button = screen.getByRole("button", { name: "Ghost" });
    expect(button.className).toMatch(/bg-transparent/);
    expect(button.className).not.toMatch(/shadow/);
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = render(GhostButton, {
        slots: { default: "Ghost" },
      });
      const results = await axe.run(container);
      expect(results.violations).toEqual([]);
    });

    it("has no axe violations in dark mode", async () => {
      document.documentElement.classList.add("dark");
      const { container } = render(GhostButton, {
        slots: { default: "Ghost" },
      });
      const results = await axe.run(container);
      document.documentElement.classList.remove("dark");
      expect(results.violations).toEqual([]);
    });
  });
});
