import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/vue";
import axe from "axe-core";
import DestructiveButton from "./DestructiveButton.vue";

vi.mock("@/components", () => ({
  Icon: {
    name: "Icon",
    props: ["name", "size"],
    template: '<svg data-testid="icon" />',
  },
}));

afterEach(cleanup);

describe("DestructiveButton", () => {
  it("renders with destructive styling", () => {
    render(DestructiveButton, { slots: { default: "Delete" } });
    const button = screen.getByRole("button", { name: "Delete" });
    expect(button.className).toMatch(/bg-red-500/);
    expect(button.className).toMatch(/text-red-50/);
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = render(DestructiveButton, {
        slots: { default: "Delete" },
      });
      const results = await axe.run(container);
      expect(results.violations).toEqual([]);
    });

    it("has no axe violations in dark mode", async () => {
      document.documentElement.classList.add("dark");
      const { container } = render(DestructiveButton, {
        slots: { default: "Delete" },
      });
      const results = await axe.run(container);
      document.documentElement.classList.remove("dark");
      expect(results.violations).toEqual([]);
    });
  });
});
