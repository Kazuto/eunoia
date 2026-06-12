<script lang="ts" setup>
import { Button } from "@/components";
import { tv } from "tailwind-variants";
import { Icon } from "@/components";
import { ref } from "vue";

defineOptions({
  inheritAttrs: false,
});

export type HeaderAction = {
  content: string;
  icon?: string;
  disabled?: boolean;
  onClick?: () => void;
};

defineProps<{ actions: HeaderAction[] }>();

const open = ref(false);

const menuStyles = tv({
  base: [
    "absolute top-full right-0 z-50 mt-1 scrollbar-subtle rounded-lg border p-1 shadow-lg",
    "border-neutral-300 bg-white",
    "dark:border-neutral-600 dark:bg-neutral-800",
  ],
});

const itemStyles = tv({
  base: [
    "flex cursor-pointer items-center gap-2 rounded-md px-3 py-2.25 text-sm text-nowrap",
    "text-neutral-900 hover:bg-neutral-200",
    "dark:text-neutral-100 dark:hover:bg-neutral-700",
  ],
  variants: {
    disabled: {
      true: "pointer-events-none cursor-not-allowed opacity-50",
    },
  },
});
</script>

<template>
  <div class="relative inline-block">
    <Button
      ghost
      icon="dots-three-vertical"
      :aria-haspopup="true"
      :aria-expanded="open"
      @click="open = !open"
    />

    <ul
      v-if="open"
      :class="menuStyles()"
      role="menu"
    >
      <li
        v-for="action in actions"
        :key="action.content"
        :class="itemStyles({ disabled: action.disabled })"
        role="menuitem"
        :aria-disabled="action.disabled || undefined"
        @click="!action.disabled && action.onClick"
      >
        <Icon
          v-if="action.icon"
          :name="action.icon"
          size="sm"
        />
        {{ action.content }}
      </li>
    </ul>
  </div>
</template>
