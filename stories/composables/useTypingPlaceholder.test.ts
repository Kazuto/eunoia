import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick, ref, type Ref } from "vue";
import { cleanup, render } from "@testing-library/vue";
import { useTypingPlaceholder } from "./useTypingPlaceholder";

afterEach(cleanup);

function mockReducedMotion(reduce: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({ matches: reduce });
}

function mountPlaceholder(
  placeholders: Ref<string[]> | string[],
  options = {}
) {
  let result!: ReturnType<typeof useTypingPlaceholder>;
  render(
    defineComponent({
      setup() {
        result = useTypingPlaceholder(placeholders, {
          typingSpeed: 10,
          deletingSpeed: 10,
          pauseDuration: 100,
          ...options,
        });
        return () => h("input", { placeholder: result.placeholder.value });
      },
    })
  );
  return result;
}

describe("useTypingPlaceholder", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockReducedMotion(false);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("types out the first string, then moves on to the next", async () => {
    const { placeholder } = mountPlaceholder(["Keys", "Text"]);

    expect(placeholder.value).toBe("K");
    await vi.advanceTimersByTimeAsync(30);
    expect(placeholder.value).toBe("Keys");

    // Pause, delete, then type the next one.
    await vi.advanceTimersByTimeAsync(100 + 40 + 10 + 40);
    expect(placeholder.value).toBe("Text");
  });

  it("shows the first string without animation for reduced motion", async () => {
    mockReducedMotion(true);
    const { placeholder } = mountPlaceholder(["Search keys", "Search text"]);

    expect(placeholder.value).toBe("Search keys");
    await vi.advanceTimersByTimeAsync(5000);
    expect(placeholder.value).toBe("Search keys");
  });

  it("starts over when the strings change", async () => {
    const strings = ref(["Keys", "Text"]);
    const { placeholder } = mountPlaceholder(strings);
    await vi.advanceTimersByTimeAsync(30);
    expect(placeholder.value).toBe("Keys");

    strings.value = ["Schlüssel", "Texte"];
    await nextTick();
    await vi.advanceTimersByTimeAsync(10 * 8);
    expect(placeholder.value).toBe("Schlüssel");
  });

  it("shows the new first string for reduced motion when the strings change", async () => {
    mockReducedMotion(true);
    const strings = ref(["Keys", "Text"]);
    const { placeholder } = mountPlaceholder(strings);

    strings.value = ["Schlüssel", "Texte"];
    await nextTick();
    expect(placeholder.value).toBe("Schlüssel");
  });

  it("waits for animate() without autoStart", async () => {
    const { placeholder, animate } = mountPlaceholder(["Keys"], {
      autoStart: false,
    });
    await vi.advanceTimersByTimeAsync(100);
    expect(placeholder.value).toBe("");

    animate();
    await vi.advanceTimersByTimeAsync(30);
    expect(placeholder.value).toBe("Keys");
  });

  it("stops when unmounted", async () => {
    const { placeholder } = mountPlaceholder(["Keys"]);
    cleanup();
    const before = placeholder.value;
    await vi.advanceTimersByTimeAsync(500);
    expect(placeholder.value).toBe(before);
  });
});
