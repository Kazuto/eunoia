import { describe, expect, it } from "vitest";
import {
  containsCurrentPage,
  currentTarget,
  isCurrentPage,
} from "./currentPage";

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

describe("currentTarget", () => {
  const items = [
    { href: "/" },
    { href: "/projects" },
    { items: [{ href: "/projects/archive" }, { to: "/settings" }] },
  ];

  it("picks the most specific item containing the page", () => {
    expect(currentTarget(items, "/projects/42")).toBe("/projects");
    expect(currentTarget(items, "/projects/archive/7")).toBe(
      "/projects/archive"
    );
    expect(currentTarget(items, "/settings")).toBe("/settings");
  });

  it("finds nothing outside the items, and the root only on itself", () => {
    expect(currentTarget(items, "/inbox")).toBeUndefined();
    expect(currentTarget(items, "/")).toBe("/");
    expect(currentTarget(items, undefined)).toBeUndefined();
  });
});
