<template>
  <div
    ref="root"
    v-bind="forwardedAttrs"
    :class="spacerStyles({ dense, class: classAttr })"
  >
    <nav
      :aria-label="ariaLabel ?? t('label')"
      :class="navStyles()"
    >
      <ul :class="listStyles({ dense })">
        <li
          v-for="(item, index) in visibleItems"
          :key="index"
          class="flex min-w-0 flex-1"
        >
          <BottomNavItemPrimitive
            :label="item.label"
            :icon="item.icon"
            :href="item.href"
            :to="item.to"
            :aria-label="item.ariaLabel"
            :aria-current="ariaCurrent(item)"
            :active="item === currentItem"
            :badge="item.badge"
            :badge-label="badgeLabel(item.badge)"
            :dense
          />
        </li>
        <li
          v-if="overflowItems.length"
          class="flex min-w-0 flex-1"
        >
          <BottomNavItemPrimitive
            :label="t('more')"
            icon="dots-three"
            :active="moreActive"
            :dense
            aria-haspopup="dialog"
            :aria-expanded="moreOpen"
            @click="moreOpen = true"
          />
        </li>
      </ul>
    </nav>

    <Drawer
      v-if="overflowItems.length"
      :open="moreOpen"
      side="bottom"
      :title="t('more')"
      :dense
      @close="moreOpen = false"
    >
      <!-- Picking a link leaves the drawer, whether or not the page reloads. -->
      <div @click="closeOnLink">
        <Menu
          :items="overflowItems"
          :current-path="moreActive ? currentTarget : undefined"
          :aria-label="t('more')"
        />
      </div>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  toRef,
  useTemplateRef,
  watch,
} from "vue";
import { tv } from "tailwind-variants";
import { Drawer, Menu } from "@/components";
import { isCurrentPage } from "../Menu/currentPage";
import {
  useForwardedAttrs,
  useLocale,
  type LocaleMessages,
} from "@/composables";
import BottomNavItemPrimitive from "./primitives/BottomNavItem.vue";

defineOptions({
  inheritAttrs: false,
});

export type BottomNavItem = {
  label: string;
  href?: string;
  /** Route for the app's router link, as with `Link`. */
  to?: string;
  icon?: string;
  ariaLabel?: string;
  /**
   * A count, or `true` for a dot. Zero and `false` show nothing. Only shown on
   * the bar itself, not for items behind "More".
   */
  badge?: number | boolean;
};

const props = withDefaults(
  defineProps<{
    /** Top-level destinations, ideally 3 to 5, each with an icon. */
    items: BottomNavItem[];
    currentPath?: string;
    /** Items on the bar; with more, the last slot becomes a "More" drawer. */
    max?: number;
    ariaLabel?: string;
    dense?: boolean;
    locale?: LocaleMessages;
  }>(),
  {
    currentPath: undefined,
    max: 5,
    ariaLabel: undefined,
    locale: undefined,
  }
);

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const t = useLocale(
  "bottom-nav",
  toRef(() => props.locale)
);

const moreOpen = ref(false);

const limit = computed(() => Math.max(2, props.max));
const visibleItems = computed(() =>
  props.items.length > limit.value
    ? props.items.slice(0, limit.value - 1)
    : props.items
);
const overflowItems = computed(() =>
  props.items.length > limit.value ? props.items.slice(limit.value - 1) : []
);

function target(item: BottomNavItem) {
  return item.href ?? item.to ?? "";
}

// The most specific destination containing the current page, so on
// /projects/42 "Projects" stays highlighted, but only one item at a time.
const currentItem = computed(() =>
  props.items
    .filter((item) => isCurrentPage(item, props.currentPath, true))
    .reduce<
      BottomNavItem | undefined
    >((best, item) => (!best || target(item).length > target(best).length ? item : best), undefined)
);

const currentTarget = computed(() =>
  currentItem.value ? target(currentItem.value) : undefined
);

const moreActive = computed(
  () =>
    currentItem.value !== undefined &&
    overflowItems.value.includes(currentItem.value)
);

function ariaCurrent(item: BottomNavItem) {
  if (item !== currentItem.value) return undefined;

  return isCurrentPage(item, props.currentPath) ? "page" : "true";
}

function badgeLabel(badge: BottomNavItem["badge"]) {
  if (typeof badge === "number" && badge > 0) {
    return t("new-count", { count: badge });
  }

  return badge === true ? t("new") : undefined;
}

function closeOnLink(event: MouseEvent) {
  if ((event.target as Element).closest("a")) moreOpen.value = false;
}

watch(
  () => props.currentPath,
  () => {
    moreOpen.value = false;
  }
);

// Hiding the bar at a breakpoint (e.g. `md:hidden`) must not leave its modal
// drawer open and the rest of the page inert.
const root = useTemplateRef<HTMLElement>("root");
let observer: ResizeObserver | undefined;

onMounted(() => {
  if (!root.value || typeof ResizeObserver === "undefined") return;

  observer = new ResizeObserver(([entry]) => {
    if (entry && entry.contentRect.height === 0) moreOpen.value = false;
  });
  observer.observe(root.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
});

// The wrapper stays in the page flow at the bar's height, so the end of the
// content isn't hidden behind the fixed bar.
const spacerStyles = tv({
  base: "shrink-0",
  variants: {
    dense: {
      false: "h-[calc(4rem+1px+env(safe-area-inset-bottom))]",
      true: "h-[calc(3.5rem+1px+env(safe-area-inset-bottom))]",
    },
  },
  defaultVariants: {
    dense: false,
  },
});

const navStyles = tv({
  base: [
    "fixed inset-x-0 bottom-0 z-40 border-t pb-[env(safe-area-inset-bottom)] font-sans backdrop-blur-md",
    "border-neutral-200 bg-white/90",
    "dark:border-neutral-800 dark:bg-neutral-900/90",
  ],
});

const listStyles = tv({
  base: "mx-auto flex max-w-xl list-none items-stretch gap-1 px-2 py-1",
  variants: {
    dense: {
      false: "h-16",
      true: "h-14",
    },
  },
  defaultVariants: {
    dense: false,
  },
});
</script>
