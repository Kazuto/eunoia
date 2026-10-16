import {
  onBeforeUnmount,
  onMounted,
  toValue,
  type MaybeRefOrGetter,
} from "vue";

export type Shortcut = {
  key: string;
  mod: boolean;
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
};

const MODIFIERS = new Set(["mod", "ctrl", "control", "alt", "option", "shift"]);

export function isMac() {
  return (
    typeof navigator !== "undefined" &&
    /mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent)
  );
}

/**
 * Parses shortcuts like "/", "Mod+K" or "Shift+?". "Mod" is ⌘ on macOS and Ctrl elsewhere.
 */
export function parseShortcut(shortcut: string): Shortcut {
  // Split on "+" but keep a literal "+" key, e.g. "Mod++".
  const parts = shortcut.split(/\+(?!$)/).map((part) => part.trim());
  const key = parts.pop() ?? "";
  const modifiers = new Set(
    parts
      .map((part) => part.toLowerCase())
      .filter((part) => MODIFIERS.has(part))
  );
  return {
    key,
    mod: modifiers.has("mod"),
    ctrl: modifiers.has("ctrl") || modifiers.has("control"),
    alt: modifiers.has("alt") || modifiers.has("option"),
    shift: modifiers.has("shift"),
  };
}

/** The keys to display, using macOS symbols on macOS. */
export function shortcutLabels(shortcut: string, mac = isMac()): string[] {
  const { key, mod, ctrl, alt, shift } = parseShortcut(shortcut);
  const labels: string[] = [];
  if (mac) {
    if (ctrl) labels.push("⌃");
    if (alt) labels.push("⌥");
    if (shift) labels.push("⇧");
    if (mod) labels.push("⌘");
  } else {
    if (mod || ctrl) labels.push("Ctrl");
    if (alt) labels.push("Alt");
    if (shift) labels.push("Shift");
  }
  labels.push(key.length === 1 ? key.toUpperCase() : key);
  return labels;
}

/** The shortcut in `aria-keyshortcuts` syntax, e.g. "Meta+K" or "/". */
export function ariaKeyShortcut(shortcut: string, mac = isMac()): string {
  const { key, mod, ctrl, alt, shift } = parseShortcut(shortcut);
  return [
    (ctrl || (mod && !mac)) && "Control",
    mod && mac && "Meta",
    alt && "Alt",
    shift && "Shift",
    key,
  ]
    .filter(Boolean)
    .join("+");
}

function isEditable(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  );
}

/**
 * Whether a key press triggers the shortcut. Shortcuts without a modifier are ignored
 * while typing in a field, so "/" can still be typed into inputs.
 */
export function matchesShortcut(
  event: KeyboardEvent,
  shortcut: string,
  mac = isMac()
): boolean {
  if (event.defaultPrevented || event.isComposing) return false;
  const { key, mod, ctrl, alt, shift } = parseShortcut(shortcut);
  const wantsMeta = mod && mac;
  const wantsCtrl = ctrl || (mod && !mac);
  if (
    event.metaKey !== wantsMeta ||
    event.ctrlKey !== wantsCtrl ||
    event.altKey !== alt
  )
    return false;
  // Shift is implied by keys like "?", so only require it when it is part of the shortcut.
  if (shift && !event.shiftKey) return false;
  if (!wantsMeta && !wantsCtrl && !alt && isEditable(event.target))
    return false;
  return event.key.toLowerCase() === key.toLowerCase();
}

/** Calls `handler` whenever the shortcut is pressed anywhere on the page. */
export function useShortcut(
  shortcut: MaybeRefOrGetter<string | undefined>,
  handler: (event: KeyboardEvent) => void
) {
  function onKeydown(event: KeyboardEvent) {
    const value = toValue(shortcut);
    if (!value || !matchesShortcut(event, value)) return;
    event.preventDefault();
    handler(event);
  }

  onMounted(() => window.addEventListener("keydown", onKeydown));
  onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));
}
