import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/vue";
import axe from "axe-core";
import PrimaryButton from "./PrimaryButton.vue";

vi.mock("@/components", () => ({
  Icon: {
    name: "Icon",
    props: ["name", "size"],
    template: '<svg data-testid="icon" />',
  },
}));

afterEach(cleanup);

describe("PrimaryButton", () => {
  it("renders with primary styling", () => {
    render(PrimaryButton, { slots: { default: "Primary" } });
    const button = screen.getByRole("button", { name: "Primary" });
    expect(button.className).toMatch(/bg-primary-500/);
    expect(button.className).toMatch(/text-primary-50/);
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = render(PrimaryButton, {
        slots: { default: "Primary" },
      });
      const results = await axe.run(container);
      expect(results.violations).toEqual([]);
    });

    it("has no axe violations in dark mode", async () => {
      document.documentElement.classList.add("dark");
      const { container } = render(PrimaryButton, {
        slots: { default: "Primary" },
      });
      const results = await axe.run(container);
      document.documentElement.classList.remove("dark");
      expect(results.violations).toEqual([]);
    });
  });
});
