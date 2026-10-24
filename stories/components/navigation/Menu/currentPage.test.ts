import { describe, expect, it } from "vitest";
import { containsCurrentPage, isCurrentPage } from "./currentPage";

describe("isCurrentPage", () => {
  it("matches the exact path through `href` or `to`", () => {
    expect(isCurrentPage({ href: "/inbox" }, "/inbox")).toBe(true);
    expect(isCurrentPage({ to: "/inbox" }, "/inbox")).toBe(true);
    expect(isCurrentPage({ href: "/inbox" }, "/inbox/3")).toBe(false);
    expect(isCurrentPage({ href: "/inbox" }, undefined)).toBe(false);
    expect(isCurrentPage({}, "/inbox")).toBe(false);
  });

  it("includes pages below the item when asked", () => {
    expect(isCurrentPage({ href: "/inbox" }, "/inbox/3", true)).toBe(true);
    expect(isCurrentPage({ href: "/inbox" }, "/inboxes", true)).toBe(false);
    expect(isCurrentPage({ href: "/" }, "/inbox", true)).toBe(false);
  });
});

describe("containsCurrentPage", () => {
  it("looks through nested items", () => {
    const items = [
      { href: "/" },
      { items: [{ href: "/a" }, { items: [{ to: "/b/c" }] }] },
    ];
    expect(containsCurrentPage(items, "/b/c")).toBe(true);
    expect(containsCurrentPage(items, "/b")).toBe(false);
  });
});
