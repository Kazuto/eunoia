import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick, ref, type Ref } from "vue";
import { cleanup, render } from "@testing-library/vue";
import { useRelativeTime } from "./useRelativeTime";

const now = Date.UTC(2026, 9, 23, 12, 0, 0);
const minute = 60_000;
const hour = 60 * minute;
const day = 24 * hour;

function mountRelativeTime(
  date: Ref<Date | string | undefined> | Date | string | undefined,
  locale?: Ref<string>
) {
  let result!: ReturnType<typeof useRelativeTime>;
  render(
    defineComponent({
      setup() {
        result = useRelativeTime(date, { locale });
        return () => h("span", result.relative.value);
      },
    })
  );
  return result;
}

describe("useRelativeTime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(now);
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it.each([
    [now, "now"],
    [now - 45_000, "45 seconds ago"],
    [now + 90_000, "in 2 minutes"],
    [now - 3 * hour, "3 hours ago"],
    [now - day, "yesterday"],
    [now + 14 * day, "in 2 weeks"],
    [now - 400 * day, "last year"],
  ])("formats %i as %s", (time, text) => {
    expect(mountRelativeTime(new Date(time)).relative.value).toBe(text);
  });

  it("keeps up as time passes", async () => {
    const { relative } = mountRelativeTime(
      new Date(now + minute).toISOString()
    );

    expect(relative.value).toBe("in 1 minute");

    await vi.advanceTimersByTimeAsync(30_000);
    expect(relative.value).toBe("in 30 seconds");

    await vi.advanceTimersByTimeAsync(31_000);
    expect(relative.value).toBe("1 second ago");
  });

  it("follows a changing date and locale", async () => {
    const date = ref<Date | string | undefined>(new Date(now - hour));
    const locale = ref("en");
    const result = mountRelativeTime(date, locale);

    expect(result.relative.value).toBe("1 hour ago");

    locale.value = "de";
    await nextTick();
    expect(result.relative.value).toBe("vor 1 Stunde");
    expect(result.date.value).toBe(
      new Date(now - hour).toLocaleDateString("de")
    );

    date.value = new Date(now + 2 * day);
    await nextTick();
    expect(result.relative.value).toBe("übermorgen");
  });

  it("formats an invalid date as empty strings", () => {
    const { relative, date, time } = mountRelativeTime("not a date");

    expect([relative.value, date.value, time.value]).toEqual(["", "", ""]);
  });

  it("formats the current time without a date", () => {
    expect(mountRelativeTime(undefined).relative.value).toBe("now");
  });

  it("runs one timer for all, while any is in use", () => {
    mountRelativeTime(new Date(now - minute));
    mountRelativeTime(new Date(now + hour));

    expect(vi.getTimerCount()).toBe(1);

    cleanup();

    expect(vi.getTimerCount()).toBe(0);
  });
});
