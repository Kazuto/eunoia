import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/vue";
import { defineComponent, h, ref } from "vue";
import Truncate from "./Truncate.vue";

afterEach(cleanup);

const settle = () => new Promise((resolve) => setTimeout(resolve, 10));

const longText =
  "A very long project title that keeps going well past the space available for it";

describe("Truncate", () => {
  it("cuts off on a single line by default", () => {
    render(Truncate, {
      props: { content: longText, maxLength: 20 },
      slots: { default: longText },
    });
    const el = screen.getByText(longText);
    expect(el.classList.contains("whitespace-nowrap")).toBe(true);
    expect(el.classList.contains("text-ellipsis")).toBe(true);
    expect(el.style.maxWidth).toBe("20ch");
    expect(el.style.getPropertyValue("-webkit-line-clamp")).toBe("");
  });

  it("clamps to the given number of lines", () => {
    render(Truncate, {
      props: { content: longText, lines: 3 },
      slots: { default: longText },
    });
    const el = screen.getByText(longText);
    expect(el.classList.contains("whitespace-nowrap")).toBe(false);
    expect(el.style.getPropertyValue("-webkit-line-clamp")).toBe("3");
    expect(el.style.display).toBe("-webkit-box");
  });

  it("treats lines=1 like the single-line default", () => {
    render(Truncate, {
      props: { content: longText, lines: 1 },
      slots: { default: longText },
    });
    expect(
      screen.getByText(longText).classList.contains("whitespace-nowrap")
    ).toBe(true);
  });

  it("re-checks a clamped box when only its text changes", async () => {
    // jsdom has no layout: model a two-line box that 40+ characters overflow.
    const heights = {
      clientHeight: () => 40,
      scrollHeight(this: HTMLElement) {
        return (this.textContent?.length ?? 0) > 40 ? 80 : 40;
      },
    };
    const originals = Object.fromEntries(
      Object.keys(heights).map((key) => [
        key,
        Object.getOwnPropertyDescriptor(Element.prototype, key),
      ])
    );
    for (const [key, get] of Object.entries(heights)) {
      Object.defineProperty(Element.prototype, key, {
        get,
        configurable: true,
      });
    }

    try {
      const text = ref("Short title");
      render(
        defineComponent(
          () => () =>
            h(Truncate, { content: text.value, lines: 2 }, () => text.value)
        )
      );
      // Past the mount-time check, which runs on a timer.
      await settle();

      const anchor = screen.getByText("Short title").parentElement!;
      await fireEvent.mouseEnter(anchor);
      expect(screen.queryByRole("tooltip")).toBeNull();
      await fireEvent.mouseLeave(anchor);

      text.value = longText;
      await settle();
      await fireEvent.mouseEnter(anchor);
      expect(screen.getByRole("tooltip").textContent).toContain(longText);
    } finally {
      for (const [key, descriptor] of Object.entries(originals)) {
        if (descriptor)
          Object.defineProperty(Element.prototype, key, descriptor);
      }
    }
  });
});
