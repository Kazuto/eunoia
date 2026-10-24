import { describe, expect, it } from "vitest";
import { hexToRgba, hsvaToHex, normalizeHex, parseHex } from "./color";

describe("color helpers", () => {
  it("parses short, long, and alpha hex forms", () => {
    expect(hexToRgba("#f00")).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    expect(hexToRgba("0F08")).toEqual({ r: 0, g: 255, b: 0, a: 136 / 255 });
    expect(hexToRgba("#0000ff")).toEqual({ r: 0, g: 0, b: 255, a: 1 });
    expect(hexToRgba("#00000080")?.a).toBeCloseTo(128 / 255);
  });

  it("rejects invalid input", () => {
    for (const bad of [
      "",
      "#",
      "#12",
      "#12345",
      "#1234567",
      "#gggggg",
      "red",
    ]) {
      expect(hexToRgba(bad)).toBeNull();
      expect(normalizeHex(bad, false)).toBeNull();
    }
  });

  it("converts primaries and grays to HSV", () => {
    expect(parseHex("#ff0000")).toEqual({ h: 0, s: 1, v: 1, a: 1 });
    expect(parseHex("#00ff00")).toMatchObject({ h: 120, s: 1, v: 1 });
    expect(parseHex("#0000ff")).toMatchObject({ h: 240, s: 1, v: 1 });
    expect(parseHex("#808080")).toMatchObject({ h: 0, s: 0 });
    expect(parseHex("#000000")).toMatchObject({ s: 0, v: 0 });
  });

  it("round-trips hex through HSVA", () => {
    for (const hex of ["#a88bc7", "#f83b66", "#47a641", "#ffffff", "#123456"]) {
      expect(hsvaToHex(parseHex(hex)!, false)).toBe(hex);
    }
    expect(hsvaToHex(parseHex("#4c87e5cc")!, true)).toBe("#4c87e5cc");
  });

  it("normalizes case, shorthand, and the alpha channel", () => {
    expect(normalizeHex("#ABC", false)).toBe("#aabbcc");
    expect(normalizeHex("abc", true)).toBe("#aabbccff");
    expect(normalizeHex("#aabbcc80", false)).toBe("#aabbcc");
  });
});
