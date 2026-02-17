<template>
  <span
    v-bind="forwardedAttrs"
    :class="avatarStyles({ size, class: classAttr })"
  >
    <img
      v-if="src && !imageError"
      :src="src"
      :alt="name ?? ''"
      class="size-full object-cover"
      @error="imageError = true"
    />
    <span
      v-else
      :class="fallbackStyles({ size })"
    >
      {{ initials }}
    </span>
  </span>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const avatarStyles = tv({
  base: "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-200 dark:bg-primary-800",
  variants: {
    size: {
      xs: "size-6",
      sm: "size-8",
      md: "size-10",
      lg: "size-12",
      xl: "size-16",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const fallbackStyles = tv({
  base: "font-sans font-medium text-primary-700 select-none dark:text-primary-200",
  variants: {
    size: {
      xs: "text-[10px]",
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
      xl: "text-xl",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const props = withDefaults(
  defineProps<{
    src?: string;
    name?: string;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
  }>(),
  {
    src: undefined,
    name: undefined,
    size: "md",
  }
);

const imageError = ref(false);

watch(
  () => props.src,
  () => {
    imageError.value = false;
  }
);

const initials = computed(() => {
  if (!props.name) return "";
  return props.name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
});
</script>
