<template>
  <div
    ref="regionRef"
    tabindex="0"
    v-bind="forwardedAttrs"
    :class="regionStyles({ class: classAttr })"
    @contextmenu="onContextMenu"
    @keydown="onRegionKeydown"
  >
    <slot />
    <!-- Always portaled, so right-clicks on the menu never reach the region. -->
    <Teleport
      v-if="isOpen"
      :to="teleportTarget"
    >
      <DropdownMenu
        :id="menuId"
        ref="menuRef"
        :dense
        :active-descendant-id="activeDescendantId"
        :aria-label="label"
        tabindex="-1"
        class="fixed top-auto right-auto left-auto mt-0 w-max max-w-80 min-w-48 outline-none"
        :style="floatingStyles"
        @keydown="onMenuKeydown"
        @contextmenu.prevent
      >
        <template
          v-for="(item, index) in items"
          :key="item.value"
        >
          <li
            v-if="item.divider && index > 0"
            role="separator"
            class="mx-2 my-1 h-px bg-neutral-200 dark:bg-neutral-700"
          />
          <DropdownItem
            :id="`${menuId}-item-${index}`"
            :label="item.label"
            :value="item.value"
            :variant="item.variant"
            :disabled="item.disabled"
            :is-active="activeIndex === index"
            :dense
            @select="select"
            @mouseenter="activeIndex = item.disabled ? -1 : index"
          />
        </template>
      </DropdownMenu>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  shallowRef,
  watch,
} from "vue";
import { tv } from "tailwind-variants";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
  type ReferenceElement,
} from "@floating-ui/vue";
import { useForwardedAttrs, useSanitizedId } from "@/composables";
import DropdownMenu from "@/components/feedback/Dropdown/primitives/DropdownMenu.vue";
import DropdownItem from "@/components/feedback/Dropdown/primitives/DropdownItem.vue";
import type { ActionMenuItem } from "@/components/feedback/ActionMenu/ActionMenu.vue";

/** ActionMenu's item shape, minus icons and hints, which the menu items do not render. */
export type ContextMenuItem = Pick<
  ActionMenuItem,
  "value" | "label" | "disabled" | "variant" | "divider"
>;

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const regionStyles = tv({
  base: [
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-2",
    "focus-visible:outline-neutral-300 dark:focus-visible:outline-neutral-600",
  ],
});

const props = withDefaults(
  defineProps<{
    items: ContextMenuItem[];
    /** Names the menu, e.g. "File actions". */
    label: string;
    dense?: boolean;
    /** Leaves the browser's own context menu in place. */
    disabled?: boolean;
    /** Where the menu is portaled to. Native dialogs own their menus. */
    teleportTo?: string | HTMLElement;
  }>(),
  {
    teleportTo: "body",
  }
);

const emit = defineEmits<{
  (e: "select", value: string): void;
}>();

const menuId = useSanitizedId("context-menu");
const isOpen = ref(false);
const activeIndex = ref(-1);
const regionRef = ref<HTMLElement | null>(null);
const menuRef = ref<InstanceType<typeof DropdownMenu> | null>(null);
const menuElement = computed<HTMLElement | null>(
  () => menuRef.value?.$el ?? null
);
const reference = shallowRef<ReferenceElement | null>(null);
const teleportTarget = ref<string | HTMLElement>("body");

let returnFocusTo: HTMLElement | null = null;

const { floatingStyles } = useFloating(reference, menuElement, {
  open: isOpen,
  placement: "bottom-start",
  strategy: "fixed",
  middleware: [offset(2), flip(), shift({ padding: 8 })],
  whileElementsMounted: autoUpdate,
});

const enabledIndices = computed(() =>
  props.items.reduce<number[]>((acc, item, index) => {
    if (!item.disabled) acc.push(index);
    return acc;
  }, [])
);

const activeDescendantId = computed(() =>
  activeIndex.value < 0 ? undefined : `${menuId}-item-${activeIndex.value}`
);

function pointAt(x: number, y: number): ReferenceElement {
  return {
    getBoundingClientRect: () => ({
      x,
      y,
      top: y,
      left: x,
      right: x,
      bottom: y,
      width: 0,
      height: 0,
    }),
  };
}

async function open(at: ReferenceElement, focusFirst: boolean) {
  if (props.disabled) return;
  if (!isOpen.value) {
    returnFocusTo = document.activeElement as HTMLElement | null;
  }
  reference.value = at;
  // A body portal is inert beneath showModal(), so stay in the dialog's top layer.
  teleportTarget.value = regionRef.value?.closest("dialog") ?? props.teleportTo;
  activeIndex.value = focusFirst ? (enabledIndices.value[0] ?? -1) : -1;
  isOpen.value = true;
  await nextTick();
  menuElement.value?.focus();
}

function close(returnFocus: boolean) {
  if (!isOpen.value) return;
  isOpen.value = false;
  activeIndex.value = -1;
  if (!returnFocus) return;
  const target = returnFocusTo?.isConnected ? returnFocusTo : regionRef.value;
  target?.focus();
}

function select(value: string) {
  const item = props.items.find((i) => i.value === value);
  if (!item || item.disabled) return;
  close(true);
  emit("select", value);
}

function onContextMenu(event: MouseEvent) {
  if (props.disabled) return;
  event.preventDefault();
  open(pointAt(event.clientX, event.clientY), false);
}

function onRegionKeydown(event: KeyboardEvent) {
  const isMenuKey =
    event.key === "ContextMenu" || (event.key === "F10" && event.shiftKey);
  if (!isMenuKey || props.disabled) return;
  event.preventDefault();
  open(event.target as HTMLElement, true);
}

function step(direction: 1 | -1) {
  const indices = enabledIndices.value;
  if (!indices.length) return;
  const pos = indices.indexOf(activeIndex.value);
  if (pos < 0) {
    activeIndex.value = direction === 1 ? indices[0] : indices.at(-1)!;
    return;
  }
  activeIndex.value =
    indices[(pos + direction + indices.length) % indices.length];
}

function onMenuKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      step(1);
      break;
    case "ArrowUp":
      event.preventDefault();
      step(-1);
      break;
    case "Home":
      event.preventDefault();
      activeIndex.value = enabledIndices.value[0] ?? -1;
      break;
    case "End":
      event.preventDefault();
      activeIndex.value = enabledIndices.value.at(-1) ?? -1;
      break;
    case "Enter":
    case " ": {
      event.preventDefault();
      const item = props.items[activeIndex.value];
      if (item) select(item.value);
      break;
    }
    case "Escape":
      // Keep a surrounding native dialog open; only the menu closes.
      event.preventDefault();
      event.stopPropagation();
      close(true);
      break;
    case "Tab":
      // The menu is portaled away from the region, so Tab would land elsewhere.
      event.preventDefault();
      close(true);
      break;
  }
}

function onClickOutside(event: MouseEvent) {
  if (menuElement.value?.contains(event.target as Node)) return;
  close(false);
}

watch(isOpen, (value) => {
  if (value) document.addEventListener("mousedown", onClickOutside);
  else document.removeEventListener("mousedown", onClickOutside);
});

watch(activeIndex, (index) => {
  if (index < 0) return;
  document
    .getElementById(`${menuId}-item-${index}`)
    ?.scrollIntoView({ block: "nearest" });
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", onClickOutside);
});
</script>
