import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/vue";
import Tooltip from "./Tooltip.vue";

afterEach(cleanup);

function renderTooltip(props: Record<string, unknown> = {}) {
  render(Tooltip, {
    props: { content: "Details", ...props },
    slots: { default: "<button>Anchor</button>" },
  });
  return screen.getByRole("button", { name: "Anchor" }).parentElement!;
}

describe("Tooltip", () => {
  it("shows on hover and hides on leave", async () => {
    const anchor = renderTooltip();

    await fireEvent.mouseEnter(anchor);
    expect(screen.getByRole("tooltip").textContent).toContain("Details");

    await fireEvent.mouseLeave(anchor);
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("shows on focus", async () => {
    renderTooltip();
    await fireEvent.focusIn(screen.getByRole("button"));
    expect(screen.queryByRole("tooltip")).not.toBeNull();
  });

  it("does not show when disabled", async () => {
    const anchor = renderTooltip({ disabled: true });
    await fireEvent.mouseEnter(anchor);
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("renders the content slot", async () => {
    render(Tooltip, {
      slots: {
        default: "<button>Anchor</button>",
        content: "<strong>Rich</strong>",
      },
    });
    await fireEvent.mouseEnter(screen.getByRole("button").parentElement!);
    expect(screen.getByRole("tooltip").querySelector("strong")).not.toBeNull();
  });

  it("stays next to its anchor by default", async () => {
    const anchor = renderTooltip();
    await fireEvent.mouseEnter(anchor);
    expect(anchor.contains(screen.getByRole("tooltip"))).toBe(true);
  });

  it("can render outside containers that would clip it", async () => {
    const anchor = renderTooltip({ teleportTo: "body" });
    await fireEvent.mouseEnter(anchor);

    const tooltip = screen.getByRole("tooltip");
    expect(anchor.contains(tooltip)).toBe(false);
    expect(tooltip.parentElement).toBe(document.body);
    // Still described by and positioned against its anchor.
    expect(anchor.getAttribute("aria-describedby")).toBe(tooltip.id);
  });

  it.each([
    ["top", "top", undefined],
    ["right", "right", undefined],
    ["top-start", "top span-right", "flip-block"],
    ["bottom-start", "bottom span-right", "flip-block"],
  ])("places %s as %s", async (placement, area, fallbacks) => {
    const anchor = renderTooltip({ placement });
    await fireEvent.mouseEnter(anchor);

    const style = screen.getByRole("tooltip").getAttribute("style") ?? "";
    expect(style).toContain(`position-area: ${area}`);
    if (fallbacks) {
      expect(style).toContain(`position-try-fallbacks: ${fallbacks}`);
    } else {
      expect(style).not.toContain("position-try-fallbacks");
    }
  });

  describe("with a delay", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("waits for the pointer to rest before showing", async () => {
      const anchor = renderTooltip({ delay: 400 });

      await fireEvent.mouseEnter(anchor);
      await vi.advanceTimersByTimeAsync(399);
      expect(screen.queryByRole("tooltip")).toBeNull();

      await vi.advanceTimersByTimeAsync(1);
      expect(screen.queryByRole("tooltip")).not.toBeNull();
    });

    it("does not show when the pointer leaves first", async () => {
      const anchor = renderTooltip({ delay: 400 });

      await fireEvent.mouseEnter(anchor);
      await vi.advanceTimersByTimeAsync(200);
      await fireEvent.mouseLeave(anchor);
      await vi.advanceTimersByTimeAsync(400);

      expect(screen.queryByRole("tooltip")).toBeNull();
    });

    it("shows at once on focus", async () => {
      renderTooltip({ delay: 400 });
      await fireEvent.focusIn(screen.getByRole("button"));
      expect(screen.queryByRole("tooltip")).not.toBeNull();
    });
  });
});
