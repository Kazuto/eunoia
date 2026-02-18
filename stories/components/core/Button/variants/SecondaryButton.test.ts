import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/vue";
import axe from "axe-core";
import SecondaryButton from "./SecondaryButton.vue";

vi.mock("@/components", () => ({
  Icon: {
    name: "Icon",
    props: ["name", "size"],
    template: '<svg data-testid="icon" />',
  },
}));

afterEach(cleanup);

describe("SecondaryButton", () => {
  it("renders with transparent bg and inset shadow", () => {
    render(SecondaryButton, { slots: { default: "Secondary" } });
    const button = screen.getByRole("button", { name: "Secondary" });
    expect(button.className).toMatch(/bg-transparent/);
    expect(button.className).toMatch(/shadow-\[inset/);
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = render(SecondaryButton, {
        slots: { default: "Secondary" },
      });
      const results = await axe.run(container);
      expect(results.violations).toEqual([]);
    });

    it("has no axe violations in dark mode", async () => {
      document.documentElement.classList.add("dark");
      const { container } = render(SecondaryButton, {
        slots: { default: "Secondary" },
      });
      const results = await axe.run(container);
      document.documentElement.classList.remove("dark");
      expect(results.violations).toEqual([]);
    });
  });
});
