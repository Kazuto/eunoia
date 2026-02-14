<template>
  <details
    v-bind="forwardedAttrs"
    :class="detailsStyles({ dense, class: classAttr })"
    :open="nativeOpen || undefined"
  >
    <summary
      :class="summaryStyles({ dense })"
      :aria-expanded="open"
      :aria-controls="contentId"
      @click.prevent="emit('toggle')"
    >
      <span class="flex-1">
        <slot name="summary" />
      </span>
      <Icon
        name="caret-right"
        size="sm"
        :class="[
          'shrink-0 transition-transform duration-200',
          expanded && 'rotate-90',
        ]"
      />
    </summary>
    <div
      :id="contentId"
      role="region"
      class="grid transition-[grid-template-rows] duration-200 ease-in-out"
      :style="{ gridTemplateRows: expanded ? '1fr' : '0fr' }"
      @transitionend.self="emit('transitionend')"
    >
      <div class="overflow-hidden">
        <div :class="contentStyles({ dense })">
          <slot />
        </div>
      </div>
    </div>
  </details>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { Icon } from "@/components";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const detailsStyles = tv({
  base: "rounded-md border border-gray-300 font-sans",
  variants: {
    dense: {
      false: "text-sm",
      true: "text-xs",
    },
  },
  defaultVariants: {
    dense: false,
  },
});

const summaryStyles = tv({
  base: "flex cursor-pointer list-none items-center gap-2 font-semibold select-none [&::-webkit-details-marker]:hidden",
  variants: {
    dense: {
      false: "px-4 py-3",
      true: "px-3 py-2",
    },
  },
  defaultVariants: {
    dense: false,
  },
});

const contentStyles = tv({
  base: "border-t border-gray-200",
  variants: {
    dense: {
      false: "px-4 py-3",
      true: "px-3 py-2",
    },
  },
  defaultVariants: {
    dense: false,
  },
});

defineProps<{
  open?: boolean;
  nativeOpen?: boolean;
  expanded?: boolean;
  dense?: boolean;
  contentId?: string;
}>();

const emit = defineEmits<{
  (e: "toggle"): void;
  (e: "transitionend"): void;
}>();
</script>
