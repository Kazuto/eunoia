export const COLORS = [
  "primary",
  "neutral",
  "gray",
  "blue",
  "green",
  "yellow",
  "red",
] as const;

export type ColorName = (typeof COLORS)[number];

export const STOPS = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const;

/** OKLCH lightness (0–1) of a "#rrggbb" color. */
export function lightness(hex: string): number {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));

  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  return 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
}
