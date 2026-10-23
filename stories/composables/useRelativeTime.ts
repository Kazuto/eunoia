import {
  computed,
  getCurrentScope,
  onScopeDispose,
  ref,
  toValue,
  type MaybeRefOrGetter,
} from "vue";

type TimeUnit =
  | "second"
  | "minute"
  | "hour"
  | "day"
  | "week"
  | "month"
  | "year";

function getRelativeTime(msDiff: number): [number, TimeUnit] {
  const seconds = Math.round(msDiff / 1000);

  if (Math.abs(seconds) < 60) {
    return [seconds, "second"];
  }

  const minutes = Math.round(seconds / 60);

  if (Math.abs(minutes) < 60) {
    return [minutes, "minute"];
  }

  const hours = Math.round(minutes / 60);

  if (Math.abs(hours) < 24) {
    return [hours, "hour"];
  }

  const days = Math.round(hours / 24);

  if (Math.abs(days) < 7) {
    return [days, "day"];
  }

  const weeks = Math.round(days / 7);

  if (Math.abs(weeks) < 4) {
    return [weeks, "week"];
  }

  const months = Math.round(weeks / 4);

  if (Math.abs(months) < 12) {
    return [months, "month"];
  }

  const years = Math.round(months / 12);

  return [years, "year"];
}

// One clock for every relative time on the page, so they change together and no
// caller runs a timer of its own. It ticks only while something uses it.
const now = ref(Date.now());
let users = 0;
let timer: ReturnType<typeof setInterval> | undefined;

function useClock() {
  users++;

  if (timer === undefined) {
    now.value = Date.now();
    timer = setInterval(() => (now.value = Date.now()), 1000);
  }

  // Outside a component or effect scope, nothing tells when it is no longer used.
  if (getCurrentScope()) {
    onScopeDispose(() => {
      users--;

      if (users === 0 && timer !== undefined) {
        clearInterval(timer);
        timer = undefined;
      }
    });
  }

  return now;
}

/**
 * Formats a date relative to now, such as "5 minutes ago" or "in 2 hours", and
 * keeps it current: every relative time shares one clock that ticks each second
 * while any is in use. Without a date, it formats the current time. An invalid
 * date formats as empty strings.
 */
export function useRelativeTime(
  date: MaybeRefOrGetter<Date | string | undefined>,
  options: {
    /** The locale to format in, also as a ref or getter; "en" by default. */
    locale?: MaybeRefOrGetter<string | undefined>;
  } = {}
) {
  const clock = useClock();
  const locale = computed(() => toValue(options.locale) ?? "en");

  const target = computed(() => {
    const value = toValue(date);

    return value === undefined ? undefined : new Date(value);
  });
  const shown = computed(() => target.value ?? new Date(clock.value));
  const valid = computed(() => !Number.isNaN(shown.value.getTime()));

  const rtf = computed(
    () => new Intl.RelativeTimeFormat(locale.value, { numeric: "auto" })
  );

  const relative = computed(() => {
    if (!valid.value) {
      return "";
    }

    const [value, unit] = getRelativeTime(shown.value.getTime() - clock.value);

    return rtf.value.format(value, unit);
  });

  const formattedDate = computed(() =>
    valid.value ? shown.value.toLocaleDateString(locale.value) : ""
  );

  const formattedTime = computed(() =>
    valid.value ? shown.value.toLocaleTimeString(locale.value) : ""
  );

  return {
    relative,
    date: formattedDate,
    time: formattedTime,
  };
}
