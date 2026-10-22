import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/vue";
import { ref } from "vue";
import Input from "./Input.vue";

vi.mock("@/components", () => ({
  Icon: { template: "<svg />" },
  Tooltip: { template: "<span><slot /></span>" },
}));

afterEach(cleanup);

describe("Input shortcut", () => {
  it("focuses the input when the shortcut is pressed and shows it as a hint", async () => {
    render(Input, {
      props: { shortcut: "/", type: "search", ariaLabel: "Search" },
      attachTo: document.body,
    });
    const input = screen.getByRole("searchbox", { name: "Search" });
    expect(input.getAttribute("aria-keyshortcuts")).toBe("/");
    expect(document.querySelector("kbd")?.textContent).toBe("/");

    await fireEvent.keyDown(window, { key: "/" });
    expect(document.activeElement).toBe(input);
  });

  it("hides the hint once there is a value", () => {
    render({
      components: { Input },
      setup: () => ({ value: ref("query") }),
      template: '<Input v-model="value" shortcut="/" aria-label="Filter" />',
    });
    expect(document.querySelector("kbd")).toBeNull();
  });

  it("ignores the shortcut while disabled", async () => {
    render(Input, {
      props: { shortcut: "/", disabled: true, ariaLabel: "Filter" },
    });
    await fireEvent.keyDown(window, { key: "/" });
    expect(document.activeElement).not.toBe(screen.getByRole("textbox"));
  });
});

describe("Search input", () => {
  // It has its own clear button, so the browser's must not show next to it.
  it("hides the browser's clear button", () => {
    render(Input, {
      props: { type: "search", ariaLabel: "Search" },
    });
    const input = screen.getByRole("searchbox", { name: "Search" });
    expect(input.className).toContain(
      "[&::-webkit-search-cancel-button]:appearance-none"
    );
  });
});
