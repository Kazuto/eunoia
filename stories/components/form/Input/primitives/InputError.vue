<template>
  <div
    v-bind="forwardedAttrs"
    :class="errorStyles({ dense, class: classAttr })"
    role="alert"
  >
    <p
      v-for="(message, i) in errors"
      :key="i"
      :class="['flex items-center gap-1', i > 0 && 'pl-4']"
    >
      <Icon
        v-if="i === 0"
        name="warning"
        size="xs"
        class="shrink-0"
      />
      {{ message }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import Icon from "@/components/core/Icon/Icon.vue";
import { useForwardedAttrs } from "@/composables/useForwardedAttrs";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

defineProps<{
  errors: string[];
  dense?: boolean;
}>();

const errorStyles = tv({
  base: "flex flex-col gap-0.5 text-red-500",
  variants: {
    dense: {
      false: "text-xs",
      true: "text-[10px]",
    },
  },
  defaultVariants: {
    dense: false,
  },
});
</script>
