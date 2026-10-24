import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/vue";
import { nextTick } from "vue";
import Carousel from "./Carousel.vue";

const items = ["One", "Two", "Three"];

function mockReducedMotion(reduce: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({ matches: reduce });
}

function renderCarousel(
  props: Record<string, unknown> = {},
  slot = '<template #default="{ item }">{{ item }}</template>'
) {
  return render(Carousel, {
    props: { items, ...props },
    slots: { default: slot },
  });
}

function mockVisibility(state: DocumentVisibilityState) {
  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    get: () => state,
  });
  document.dispatchEvent(new Event("visibilitychange"));
}

function slides() {
  return screen.getAllByRole("group");
}

beforeEach(() => {
  // jsdom doesn't scroll; the component only needs the call to succeed.
  Element.prototype.scrollTo = vi.fn();
  mockReducedMotion(false);
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  // Drop the override so the prototype's real getter shows through again.
  delete (document as { visibilityState?: unknown }).visibilityState;
});

describe("Carousel", () => {
  it("is a labelled carousel region of labelled slides", () => {
    renderCarousel();
    const region = screen.getByRole("region", { name: "Carousel" });
    expect(region.getAttribute("aria-roledescription")).toBe("carousel");
    expect(slides().map((slide) => slide.getAttribute("aria-label"))).toEqual([
      "Slide 1 of 3",
      "Slide 2 of 3",
      "Slide 3 of 3",
    ]);
    expect(slides()[0].getAttribute("aria-roledescription")).toBe("slide");
  });

  it("keeps only the current slide interactive", () => {
    renderCarousel({ modelValue: 1 });
    expect(slides().map((slide) => slide.hasAttribute("inert"))).toEqual([
      true,
      false,
      true,
    ]);
  });

  it("moves with the previous and next buttons", async () => {
    const { emitted } = renderCarousel();
    const previous = screen.getByRole("button", { name: "Previous slide" });
    expect(previous.hasAttribute("disabled")).toBe(true);

    await fireEvent.click(screen.getByRole("button", { name: "Next slide" }));
    expect(emitted()["update:modelValue"]).toEqual([[1]]);
    expect(slides()[1].hasAttribute("inert")).toBe(false);
  });

  it("stops at the ends unless it loops", async () => {
    const { emitted, rerender } = renderCarousel({ modelValue: 2 });
    const nextButton = screen.getByRole("button", { name: "Next slide" });
    expect(nextButton.hasAttribute("disabled")).toBe(true);

    await rerender({ items, modelValue: 2, loop: true });
    await fireEvent.click(nextButton);
    expect(emitted()["update:modelValue"]).toEqual([[0]]);
  });

  it("jumps to a slide from its indicator", async () => {
    const { emitted } = renderCarousel();
    const indicator = screen.getByRole("button", { name: "Go to slide 3" });
    await fireEvent.click(indicator);
    expect(emitted()["update:modelValue"]).toEqual([[2]]);
    expect(indicator.getAttribute("aria-current")).toBe("true");
  });

  it("moves with the arrow keys", async () => {
    const { emitted } = renderCarousel();
    const region = screen.getByRole("region");
    await fireEvent.keyDown(region, { key: "ArrowRight" });
    await fireEvent.keyDown(region, { key: "ArrowLeft" });
    expect(emitted()["update:modelValue"]).toEqual([[1], [0]]);
  });

  it("moves focus out of a slide before it turns inert", async () => {
    const { container } = renderCarousel(
      {},
      '<template #default="{ item }"><a href="#">{{ item }}</a></template>'
    );
    const link = screen.getByRole("link", { name: "One" });
    link.focus();
    await fireEvent.keyDown(link, { key: "ArrowRight" });

    expect(slides()[0].hasAttribute("inert")).toBe(true);
    expect(document.activeElement).toBe(container.querySelector("[aria-live]"));
  });

  it("scrolls to a slide that is added and selected together", async () => {
    const { rerender } = renderCarousel({ modelValue: 0 });
    vi.mocked(Element.prototype.scrollTo).mockClear();

    await rerender({ items: [...items, "Four"], modelValue: 3 });
    expect(Element.prototype.scrollTo).toHaveBeenCalledTimes(1);
  });

  describe("autoplay", () => {
    it("advances, wraps, and stops when paused", async () => {
      vi.useFakeTimers();
      const { emitted } = renderCarousel({ autoplay: 1000, modelValue: 2 });
      await nextTick();

      vi.advanceTimersByTime(1000);
      expect(emitted()["update:modelValue"]).toEqual([[0]]);

      await fireEvent.click(
        screen.getByRole("button", { name: "Pause autoplay" })
      );
      vi.advanceTimersByTime(3000);
      expect(emitted()["update:modelValue"]).toHaveLength(1);
      expect(
        screen.getByRole("button", { name: "Start autoplay" })
      ).toBeTruthy();
    });

    it("pauses while hovered and announces slides only when not rotating", async () => {
      vi.useFakeTimers();
      const { emitted } = renderCarousel({ autoplay: 1000 });
      await nextTick();
      const region = screen.getByRole("region");
      const viewport = region.querySelector("[aria-live]")!;
      expect(viewport.getAttribute("aria-live")).toBe("off");

      await fireEvent.mouseEnter(region);
      vi.advanceTimersByTime(3000);
      expect(emitted()["update:modelValue"]).toBeUndefined();
      expect(viewport.getAttribute("aria-live")).toBe("polite");
    });

    it("keeps rotating after Start while focus stays on the control", async () => {
      vi.useFakeTimers();
      const { emitted } = renderCarousel({ autoplay: 1000 });
      await nextTick();
      const toggle = screen.getByRole("button", { name: "Pause autoplay" });
      toggle.focus();
      await fireEvent.click(toggle);
      await fireEvent.click(
        screen.getByRole("button", { name: "Start autoplay" })
      );

      vi.advanceTimersByTime(1000);
      expect(emitted()["update:modelValue"]).toEqual([[1]]);
      expect(toggle.getAttribute("aria-label")).toBe("Pause autoplay");
    });

    it("stops for good once focus moves into the carousel", async () => {
      vi.useFakeTimers();
      const { emitted } = renderCarousel({ autoplay: 1000 });
      await nextTick();
      const viewport = screen
        .getByRole("region")
        .querySelector<HTMLElement>("[aria-live]")!;
      viewport.focus();
      await nextTick();
      expect(
        screen.getByRole("button", { name: "Start autoplay" })
      ).toBeTruthy();

      viewport.blur();
      vi.advanceTimersByTime(3000);
      expect(emitted()["update:modelValue"]).toBeUndefined();
    });

    it("pauses while the page is hidden", async () => {
      vi.useFakeTimers();
      const { emitted } = renderCarousel({ autoplay: 1000 });
      await nextTick();

      mockVisibility("hidden");
      await nextTick();
      vi.advanceTimersByTime(3000);
      expect(emitted()["update:modelValue"]).toBeUndefined();

      mockVisibility("visible");
      await nextTick();
      vi.advanceTimersByTime(1000);
      expect(emitted()["update:modelValue"]).toEqual([[1]]);
    });

    it("doesn't start for users who prefer reduced motion", async () => {
      vi.useFakeTimers();
      mockReducedMotion(true);
      const { emitted } = renderCarousel({ autoplay: 1000 });
      await nextTick();

      vi.advanceTimersByTime(3000);
      expect(emitted()["update:modelValue"]).toBeUndefined();
      expect(
        screen.getByRole("button", { name: "Start autoplay" })
      ).toBeTruthy();
    });
  });
});
