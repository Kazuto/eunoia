import { describe, expect, it } from "vitest";
import {
  ariaKeyShortcut,
  matchesShortcut,
  parseShortcut,
  shortcutLabels,
} from "./useShortcut";

function key(init: KeyboardEventInit & { target?: EventTarget }) {
  const event = new KeyboardEvent("keydown", { ...init, cancelable: true });
  if (init.target)
    Object.defineProperty(event, "target", { value: init.target });
  return event;
}

describe("parseShortcut", () => {
  it("splits modifiers and keeps a literal plus key", () => {
    expect(parseShortcut("Mod+Shift+K")).toEqual({
      key: "K",
      mod: true,
      ctrl: false,
      alt: false,
      shift: true,
    });
    expect(parseShortcut("Mod++").key).toBe("+");
    expect(parseShortcut("/").key).toBe("/");
  });
});

describe("shortcutLabels", () => {
  it("uses symbols on macOS and words elsewhere", () => {
    expect(shortcutLabels("Mod+K", true)).toEqual(["⌘", "K"]);
    expect(shortcutLabels("Mod+K", false)).toEqual(["Ctrl", "K"]);
    expect(shortcutLabels("Alt+Shift+p", false)).toEqual(["Alt", "Shift", "P"]);
    expect(shortcutLabels("/", true)).toEqual(["/"]);
  });
});

describe("ariaKeyShortcut", () => {
  it("maps Mod to Meta on macOS and Control elsewhere", () => {
    expect(ariaKeyShortcut("Mod+K", true)).toBe("Meta+K");
    expect(ariaKeyShortcut("Mod+K", false)).toBe("Control+K");
    expect(ariaKeyShortcut("/", false)).toBe("/");
  });
});

describe("matchesShortcut", () => {
  it("matches bare keys outside of fields only", () => {
    expect(matchesShortcut(key({ key: "/" }), "/", false)).toBe(true);
    const input = document.createElement("input");
    expect(matchesShortcut(key({ key: "/", target: input }), "/", false)).toBe(
      false
    );
  });

  it("requires the exact modifiers", () => {
    expect(matchesShortcut(key({ key: "/", ctrlKey: true }), "/", false)).toBe(
      false
    );
    expect(
      matchesShortcut(key({ key: "k", metaKey: true }), "Mod+K", true)
    ).toBe(true);
    expect(
      matchesShortcut(key({ key: "k", ctrlKey: true }), "Mod+K", true)
    ).toBe(false);
    expect(
      matchesShortcut(key({ key: "k", ctrlKey: true }), "Mod+K", false)
    ).toBe(true);
  });

  it("lets modifier shortcuts work while typing in a field", () => {
    const input = document.createElement("input");
    expect(
      matchesShortcut(
        key({ key: "k", ctrlKey: true, target: input }),
        "Mod+K",
        false
      )
    ).toBe(true);
  });

  it("does not require Shift for keys that imply it", () => {
    expect(matchesShortcut(key({ key: "?", shiftKey: true }), "?", false)).toBe(
      true
    );
  });
});
