<template>
  <div
    v-if="hasActions"
    class="relative flex shrink-0 items-center gap-2"
  >
    <!-- Unseen copies of every button, to know how wide each one is. -->
    <div
      ref="measure"
      aria-hidden="true"
      inert
      class="pointer-events-none invisible absolute top-0 right-0 flex h-0 w-max items-center gap-2 overflow-hidden whitespace-nowrap"
    >
      <Button
        v-for="(action, index) in inline"
        :key="index"
        ghost
        :dense
        :icon="action.icon"
      >
        {{ action.content }}
      </Button>
      <template v-if="primaryAction">
        <Button
          primary
          :dense
          :icon="primaryAction.icon"
        >
          {{ primaryAction.content }}
        </Button>
        <Button
          primary
          :dense
          :icon="primaryAction.icon ?? 'plus'"
        />
      </template>
      <Button
        ghost
        :dense
        icon="dots-three-vertical"
      />
    </div>

    <Button
      v-for="(action, index) in inline.slice(0, inlineCount)"
      :key="index"
      ghost
      :dense
      :icon="action.icon"
      :disabled="action.disabled"
      @click="action.onClick"
    >
      {{ action.content }}
    </Button>

    <Button
      v-if="primaryAction && primaryMode === 'full'"
      primary
      :dense
      :icon="primaryAction.icon"
      :disabled="primaryAction.disabled"
      @click="primaryAction.onClick"
    >
      {{ primaryAction.content }}
    </Button>
    <Tooltip
      v-else-if="primaryAction && primaryMode === 'icon'"
      :content="primaryAction.content"
    >
      <Button
        primary
        :dense
        :icon="primaryAction.icon"
        :disabled="primaryAction.disabled"
        :aria-label="primaryAction.content"
        @click="primaryAction.onClick"
      />
    </Tooltip>

    <ActionMenu
      v-if="menuItems.length"
      :items="menuItems"
      :label="t('more-actions')"
      icon="dots-three-vertical"
      :dense
      @select="selectFromMenu"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  useTemplateRef,
  watch,
} from "vue";
import { ActionMenu, Button, Tooltip } from "@/components";
import type { ActionMenuItem } from "@/components/feedback/ActionMenu/ActionMenu.vue";
import { useLocale } from "@/composables";
import type { HeaderAction } from "@/types";

const props = withDefaults(
  defineProps<{
    /** Shown as buttons while there's room, then moved into the menu, last first. */
    actions?: HeaderAction[];
    primaryAction?: HeaderAction;
    /** Always in the menu. */
    secondaryActions?: HeaderAction[];
    dense?: boolean;
    /** The row the title and the actions share. */
    row?: HTMLElement | null;
    /** The title next to the actions, which keeps up to 12rem of the row. */
    titleGroup?: HTMLElement | null;
  }>(),
  {
    actions: () => [],
    primaryAction: undefined,
    secondaryActions: () => [],
    row: undefined,
    titleGroup: undefined,
  }
);

const t = useLocale("header");

const GAP = 8; // gap-2 between the buttons
const TITLE_GAP = 12; // gap-3 between the title and the buttons
const TITLE_RESERVE_REM = 12;

type PrimaryMode = "full" | "icon" | "menu";

const inline = computed(() => props.actions);
const hasActions = computed(
  () =>
    inline.value.length > 0 ||
    !!props.primaryAction ||
    props.secondaryActions.length > 0
);

// Everything shows until there's a measurement saying otherwise.
const inlineCount = ref(Infinity);
const primaryMode = ref<PrimaryMode>("full");

const measureBox = useTemplateRef<HTMLElement>("measure");

/** How much wider the title would need to be to show everything it truncates. */
function titleWidth(title: HTMLElement) {
  let hidden = 0;
  for (const element of title.querySelectorAll<HTMLElement>("*")) {
    hidden = Math.max(hidden, element.scrollWidth - element.clientWidth);
  }

  return title.getBoundingClientRect().width + hidden;
}

function update() {
  const box = measureBox.value;
  const rowWidth = props.row?.getBoundingClientRect().width ?? 0;
  // Not laid out (hidden, or no layout engine): keep showing everything.
  if (!box || rowWidth === 0) {
    inlineCount.value = Infinity;
    primaryMode.value = "full";
    return;
  }

  const widths = [...box.children].map(
    (element) => (element as HTMLElement).offsetWidth
  );
  const inlineWidths = widths.slice(0, inline.value.length);
  const [primaryFull = 0, primaryIcon = 0] = props.primaryAction
    ? widths.slice(inline.value.length, inline.value.length + 2)
    : [];
  const moreWidth = widths[widths.length - 1] ?? 0;

  const rootSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  );
  const reserve = props.titleGroup
    ? Math.min(titleWidth(props.titleGroup), TITLE_RESERVE_REM * rootSize) +
      TITLE_GAP
    : 0;
  const available = rowWidth - reserve;

  function widthOf(count: number, mode: PrimaryMode) {
    const parts = inlineWidths.slice(0, count);
    if (props.primaryAction && mode === "full") parts.push(primaryFull);
    if (props.primaryAction && mode === "icon") parts.push(primaryIcon);
    const needsMenu =
      props.secondaryActions.length > 0 ||
      count < inline.value.length ||
      (!!props.primaryAction && mode === "menu");
    if (needsMenu) parts.push(moreWidth);

    return (
      parts.reduce((sum, width) => sum + width, 0) +
      GAP * Math.max(0, parts.length - 1)
    );
  }

  // Inline actions go first, then the primary action shrinks to its icon,
  // and only then moves into the menu as well.
  const steps: [number, PrimaryMode][] = [];
  for (let count = inline.value.length; count >= 0; count--) {
    steps.push([count, "full"]);
  }
  if (props.primaryAction?.icon) steps.push([0, "icon"]);
  if (props.primaryAction) steps.push([0, "menu"]);

  const [count, mode] =
    steps.find(([count, mode]) => widthOf(count, mode) <= available) ??
    steps[steps.length - 1]!;
  inlineCount.value = count;
  primaryMode.value = mode;
}

type MenuEntry = { value: string; action: HeaderAction };

const menuEntries = computed(() => {
  const collapsed: MenuEntry[] = [];
  if (props.primaryAction && primaryMode.value === "menu") {
    collapsed.push({ value: "primary", action: props.primaryAction });
  }
  inline.value.forEach((action, index) => {
    if (index >= inlineCount.value) {
      collapsed.push({ value: `action-${index}`, action });
    }
  });
  const secondary = props.secondaryActions.map((action, index) => ({
    value: `secondary-${index}`,
    action,
  }));

  return { collapsed, all: [...collapsed, ...secondary] };
});

const menuItems = computed<ActionMenuItem[]>(() =>
  menuEntries.value.all.map(({ value, action }, index) => ({
    value,
    label: action.content,
    icon: action.icon,
    disabled: action.disabled,
    // Separates the collapsed buttons from the actions that always live here.
    divider: index === menuEntries.value.collapsed.length,
  }))
);

function selectFromMenu(value: string) {
  menuEntries.value.all
    .find((entry) => entry.value === value)
    ?.action.onClick?.();
}

let observer: ResizeObserver | undefined;
let frame = 0;

// The row's width sets the space, and the title's size changes with its text.
// Moving buttons resizes the title in turn, so the update waits for the next
// frame; resizing an observed element from within the callback ends in a
// "ResizeObserver loop" error.
function observe() {
  observer?.disconnect();
  if (typeof ResizeObserver === "undefined") return;

  observer = new ResizeObserver(() => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(update);
  });
  if (props.row) observer.observe(props.row);
  if (props.titleGroup) observer.observe(props.titleGroup);
}

onMounted(() => {
  observe();
  update();
  document.fonts?.ready.then(update);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  cancelAnimationFrame(frame);
});

watch(() => [props.row, props.titleGroup], observe);
watch(
  () => [
    props.row,
    props.titleGroup,
    props.actions,
    props.primaryAction,
    props.secondaryActions,
    props.dense,
  ],
  update,
  { flush: "post", deep: true }
);
</script>
