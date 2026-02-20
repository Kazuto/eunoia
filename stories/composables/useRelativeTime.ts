import { ref, computed, onUnmounted, toValue, MaybeRefOrGetter } from "vue";

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

export function useRelativeTime(
  date: MaybeRefOrGetter<Date | string | undefined>,
  options: {
    locale: "en";
    interval: 60000;
  }
) {
  const { locale = "en", interval = 1000 } = options;
  const now = ref(Date.now());

  // auto-update every interval
  const timer = setInterval(() => (now.value = Date.now()), interval);

  onUnmounted(() => clearInterval(timer));

  const rtf = computed(
    () => new Intl.RelativeTimeFormat(options.locale, { numeric: "auto" })
  );

  const relative = computed(() => {
    const target = new Date(toValue(date) ?? new Date()).getTime();
    const diff = target - now.value;

    const [value, unit] = getRelativeTime(diff);

    return rtf.value.format(value, unit);
  });

  const formattedDate = computed(() => {
    const d = new Date(toValue(date) ?? new Date());

    return d.toLocaleDateString(locale);
  });

  const formattedTime = computed(() => {
    const d = new Date(toValue(date) ?? new Date());

    return d.toLocaleTimeString(locale);
  });

  return {
    relative,
    date: formattedDate,
    time: formattedTime,
  };
}
