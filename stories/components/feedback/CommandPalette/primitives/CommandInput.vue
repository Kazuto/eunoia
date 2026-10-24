<template>
  <div :class="wrapperStyles({ dense })">
    <Icon
      name="magnifying-glass"
      :size="dense ? 'sm' : 'md'"
      class="text-neutral-400 dark:text-neutral-500"
    />
    <input
      ref="inputRef"
      v-model="model"
      v-bind="forwardedAttrs"
      type="text"
      autocomplete="off"
      spellcheck="false"
      :class="inputStyles({ dense, class: classAttr })"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";
import { Icon } from "@/components";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

defineProps<{
  dense?: boolean;
}>();

const model = defineModel<string>({ default: "" });

const inputRef = ref<HTMLInputElement | null>(null);

defineExpose({
  focus: () => inputRef.value?.focus(),
});

const wrapperStyles = tv({
  base: [
    "flex shrink-0 items-center gap-2 border-b",
    "border-neutral-200",
    "dark:border-neutral-700",
  ],
  variants: {
    dense: {
      false: "px-4",
      true: "px-3",
    },
  },
  defaultVariants: {
    dense: false,
  },
});

const inputStyles = tv({
  base: [
    "w-full bg-transparent outline-none",
    "text-neutral-900 placeholder:text-neutral-400",
    "dark:text-neutral-100 dark:placeholder:text-neutral-500",
  ],
  variants: {
    dense: {
      false: "py-3.5 text-base",
      true: "py-2.5 text-sm",
    },
  },
  defaultVariants: {
    dense: false,
  },
});
</script>
