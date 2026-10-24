/** h: 0–360, s/v/a: 0–1 */
export type Hsva = { h: number; s: number; v: number; a: number };
export type Rgba = { r: number; g: number; b: number; a: number };

const HEX_PATTERN = /^#?([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

export function hexToRgba(input: string): Rgba | null {
  const match = HEX_PATTERN.exec(input.trim());
  if (!match) return null;

  let digits = match[1];
  if (digits.length <= 4) {
    digits = [...digits].map((d) => d + d).join("");
  }

  const channel = (i: number) => parseInt(digits.slice(i, i + 2), 16);
  return {
    r: channel(0),
    g: channel(2),
    b: channel(4),
    a: digits.length === 8 ? channel(6) / 255 : 1,
  };
}

export function rgbToHsv(r: number, g: number, b: number) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const delta = max - Math.min(rn, gn, bn);

  let h = 0;
  if (delta !== 0) {
    if (max === rn) h = ((gn - bn) / delta) % 6;
    else if (max === gn) h = (bn - rn) / delta + 2;
    else h = (rn - gn) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  return { h, s: max === 0 ? 0 : delta / max, v: max };
}

export function hsvToRgb(h: number, s: number, v: number) {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
  };
  return {
    r: Math.round(f(5) * 255),
    g: Math.round(f(3) * 255),
    b: Math.round(f(1) * 255),
  };
}

export function parseHex(input: string): Hsva | null {
  const rgba = hexToRgba(input);
  if (!rgba) return null;
  return { ...rgbToHsv(rgba.r, rgba.g, rgba.b), a: rgba.a };
}

const toHexPair = (n: number) =>
  Math.round(Math.min(255, Math.max(0, n)))
    .toString(16)
    .padStart(2, "0");

export function hsvaToHex(hsva: Hsva, withAlpha: boolean): string {
  const { r, g, b } = hsvToRgb(hsva.h, hsva.s, hsva.v);
  const hex = `#${toHexPair(r)}${toHexPair(g)}${toHexPair(b)}`;
  return withAlpha ? hex + toHexPair(hsva.a * 255) : hex;
}

/** Canonical lowercase "#rrggbb" (or "#rrggbbaa"), or null when unparseable. */
export function normalizeHex(input: string, withAlpha: boolean): string | null {
  const rgba = hexToRgba(input);
  if (!rgba) return null;
  const hex = `#${toHexPair(rgba.r)}${toHexPair(rgba.g)}${toHexPair(rgba.b)}`;
  return withAlpha ? hex + toHexPair(rgba.a * 255) : hex;
}
