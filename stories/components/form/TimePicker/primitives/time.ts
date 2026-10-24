export type TimeParts = { hours: number; minutes: number; seconds: number };

const pad = (n: number) => String(n).padStart(2, "0");

export function parseTime(value: string | null | undefined): TimeParts | null {
  if (!value) return null;
  const match = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(value);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = Number(match[3] ?? 0);
  if (hours > 23 || minutes > 59 || seconds > 59) return null;
  return { hours, minutes, seconds };
}

export function serializeTime(parts: TimeParts, withSeconds: boolean): string {
  const base = `${pad(parts.hours)}:${pad(parts.minutes)}`;
  return withSeconds ? `${base}:${pad(parts.seconds)}` : base;
}

export function formatTime(
  parts: TimeParts,
  { seconds, hour12 }: { seconds: boolean; hour12: boolean }
): string {
  const date = new Date(2000, 0, 1, parts.hours, parts.minutes, parts.seconds);
  return date.toLocaleTimeString(undefined, {
    hour: hour12 ? "numeric" : "2-digit",
    minute: "2-digit",
    second: seconds ? "2-digit" : undefined,
    hour12,
  });
}

export function dayPeriodLabels(): [string, string] {
  const format = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    hour12: true,
  });
  const label = (hours: number) =>
    format
      .formatToParts(new Date(2000, 0, 1, hours))
      .find((part) => part.type === "dayPeriod")?.value;
  return [label(9) ?? "AM", label(21) ?? "PM"];
}

export function padTime(n: number): string {
  return pad(n);
}
