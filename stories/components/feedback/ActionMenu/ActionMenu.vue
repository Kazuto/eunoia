<template>
  <div
    ref="containerRef"
    class="relative inline-block"
    :style="anchorStyle"
  >
    <Button
      v-bind="$attrs"
      ghost
      :dense
      :icon
      :disabled
      :aria-label="label"
      aria-haspopup="menu"
      :aria-expanded="isOpen"
      :aria-controls="isOpen ? menuId : undefined"
      @click="toggle"
      @keydown="handleTriggerKeydown"
    />
    <ul
      v-if="isOpen"
      :id="menuId"
      ref="menuRef"
      role="menu"
      tabindex="-1"
      :aria-label="label"
      :class="menuStyles()"
      :style="positionStyle"
      @keydown="handleMenuKeydown"
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
        <li role="none">
          <button
            :id="`${menuId}-item-${index}`"
            type="button"
            role="menuitem"
            tabindex="-1"
            :aria-disabled="item.disabled || undefined"
            :aria-describedby="
              item.hint ? `${menuId}-hint-${index}` : undefined
            "
            :class="
              itemStyles({
                dense,
                variant: item.variant,
                disabled: item.disabled,
              })
            "
            @click="select(item)"
            @mousemove="focusItem(index)"
          >
            <Icon
              v-if="item.icon"
              :name="item.icon"
              :size="dense ? 'xs' : 'sm'"
              class="mt-0.5 shrink-0"
            />
            <span class="flex min-w-0 flex-col text-left">
              <span>{{ item.label }}</span>
              <span
                v-if="item.hint"
                :id="`${menuId}-hint-${index}`"
                class="text-xs font-normal text-neutral-500 dark:text-neutral-400"
                >{{ item.hint }}</span
              >
            </span>
          </button>
        </li>
      </template>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { tv } from "tailwind-variants";
import { useSanitizedId } from "@/composables";
import Button from "@/components/core/Button/Button.vue";
import Icon from "@/components/core/Icon/Icon.vue";

export type ActionMenuItem = {
  /** Emitted with `select`. */
  value: string;
  label: string;
  icon?: string;
  /** A second line, e.g. why the action is disabled right now. */
  hint?: string;
  disabled?: boolean;
  variant?: "default" | "danger";
  /** Draws a line above the item, to group actions. */
  divider?: boolean;
};

export type ActionMenuPlacement = "bottom-start" | "bottom-end";

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    items: ActionMenuItem[];
    /** Names the button and the menu, e.g. "Document actions". */
    label: string;
    icon?: string;
    /** Which edge of the button the menu lines up with. */
    placement?: ActionMenuPlacement;
    dense?: boolean;
    disabled?: boolean;
  }>(),
  {
    icon: "dots-three",
    placement: "bottom-end",
  }
);

const emit = defineEmits<{
  (e: "select", value: string): void;
}>();

const id = useSanitizedId("action-menu");
const menuId = `${id}-menu`;
const anchorName = `--${id}`;
const anchorStyle = { "anchor-name": anchorName } as Record<string, string>;

const positionStyle = computed(
  () =>
    ({
      position: "fixed",
      "position-anchor": anchorName,
      // Spans from the button's center toward the side the menu opens to, so
      // the menu lines up with the button's outer edge.
      "position-area":
        props.placement === "bottom-start"
          ? "bottom span-right"
          : "bottom span-left",
      "position-try-fallbacks": "flip-block",
    }) as Record<string, string>
);

const menuStyles = tv({
  base: [
    "z-50 my-1.5 max-w-80 min-w-56 overflow-auto rounded-[16px] border p-1 shadow-lg squircle",
    "border-neutral-300 bg-white",
    "dark:border-neutral-600 dark:bg-neutral-800",
  ],
});

const itemStyles = tv({
  base: [
    "flex w-full cursor-pointer items-start gap-2 rounded-[10px] font-medium outline-none squircle",
    "text-neutral-900 focus:bg-neutral-200",
    "dark:text-neutral-100 dark:focus:bg-neutral-700",
  ],
  variants: {
    dense: {
      false: "px-3 py-2.25 text-sm",
      true: "px-2.5 py-2 text-xs",
    },
    variant: {
      default: "",
      danger:
        "text-red-600 focus:bg-red-100 dark:text-red-400 dark:focus:bg-red-950",
    },
    // Disabled items stay focusable, so their hint can be read.
    disabled: {
      true: "cursor-not-allowed opacity-50",
    },
  },
  defaultVariants: {
    dense: false,
    variant: "default",
  },
});

const isOpen = ref(false);
const containerRef = ref<HTMLElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);

function menuItems() {
  return Array.from(
    menuRef.value?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []
  );
}

function focusItem(index: number) {
  const items = menuItems();
  if (!items.length) return;
  const wrapped = (index + items.length) % items.length;
  items[wrapped]?.focus();
}

function focusedIndex() {
  return menuItems().findIndex((item) => item === document.activeElement);
}

async function open(focus: "first" | "last" | "menu" = "menu") {
  if (props.disabled) return;
  isOpen.value = true;
  await nextTick();
  if (focus === "first") focusItem(0);
  else if (focus === "last") focusItem(-1);
  else menuRef.value?.focus();
}

function close(returnFocus = true) {
  if (!isOpen.value) return;
  isOpen.value = false;
  if (returnFocus) {
    containerRef.value?.querySelector<HTMLElement>("button")?.focus();
  }
}

function toggle() {
  if (isOpen.value) close();
  else open("first");
}

function select(item: ActionMenuItem) {
  if (item.disabled) return;
  close();
  emit("select", item.value);
}

function handleTriggerKeydown(event: KeyboardEvent) {
  if (event.key === "ArrowDown") {
    event.preventDefault();
    open("first");
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    open("last");
  }
}

function handleMenuKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      focusItem(focusedIndex() + 1);
      break;
    case "ArrowUp":
      event.preventDefault();
      focusItem(focusedIndex() < 0 ? -1 : focusedIndex() - 1);
      break;
    case "Home":
      event.preventDefault();
      focusItem(0);
      break;
    case "End":
      event.preventDefault();
      focusItem(-1);
      break;
    case "Escape":
      event.preventDefault();
      close();
      break;
    case "Tab":
      close(false);
      break;
  }
}

function onClickOutside(event: MouseEvent) {
  if (
    containerRef.value &&
    !containerRef.value.contains(event.target as Node)
  ) {
    close(false);
  }
}

watch(isOpen, (value) => {
  if (value) document.addEventListener("mousedown", onClickOutside);
  else document.removeEventListener("mousedown", onClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", onClickOutside);
});
</script>
