type NavLink = { href?: string; to?: string; items?: NavLink[] };

/**
 * Whether the item links to `path`. With `includeSubpages`, a page below the
 * item counts too, so `/projects` stays current on `/projects/42`. The root `/`
 * only ever matches itself.
 */
export function isCurrentPage(
  item: NavLink,
  path: string | undefined,
  includeSubpages = false
): boolean {
  const target = item.href ?? item.to;
  if (path === undefined || target === undefined) return false;
  if (target === path) return true;

  return includeSubpages && target !== "/" && path.startsWith(`${target}/`);
}

/**
 * The link of the most specific item, nested ones included, that contains
 * `path`: on `/projects/42`, "Projects" is current, but only one item is.
 */
export function currentTarget(
  items: NavLink[],
  path: string | undefined
): string | undefined {
  let best: string | undefined;
  for (const item of items) {
    const target = item.href ?? item.to;
    if (
      target !== undefined &&
      isCurrentPage(item, path, true) &&
      (best === undefined || target.length > best.length)
    ) {
      best = target;
    }

    const nested = item.items && currentTarget(item.items, path);
    if (
      nested !== undefined &&
      (best === undefined || nested.length > best.length)
    ) {
      best = nested;
    }
  }

  return best;
}

/** Whether any item, or any of their sub-items, links to `path`. */
export function containsCurrentPage(
  items: NavLink[],
  path: string | undefined
): boolean {
  return items.some(
    (item) =>
      isCurrentPage(item, path) ||
      (item.items !== undefined && containsCurrentPage(item.items, path))
  );
}
