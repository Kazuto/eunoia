<script lang="ts" setup>
import { Button } from "@/components";
import { tv } from "tailwind-variants";
import { Icon } from "@/components";
import { ref } from "vue";
import type { HeaderAction } from "@/types";

defineOptions({
  inheritAttrs: false,
});

defineProps<{ actions: HeaderAction[]; dense?: boolean }>();

const open = ref(false);

function selectAction(action: HeaderAction) {
  if (action.disabled) return;

  action.onClick?.();
  open.value = false;
}

const menuStyles = tv({
  base: [
    "absolute top-full right-0 z-50 mt-1 rounded-[16px] border p-1 shadow-lg squircle",
    "border-neutral-300 bg-white",
    "dark:border-neutral-600 dark:bg-neutral-800",
  ],
});

const itemStyles = tv({
  base: [
    "flex cursor-pointer items-center gap-2 rounded-[10px] px-3 py-2.25 text-sm text-nowrap squircle",
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
      :dense
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
        @click="selectAction(action)"
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
