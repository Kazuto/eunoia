import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/vue";
import { userEvent } from "@testing-library/user-event";
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
