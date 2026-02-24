<template>
  <dialog
    ref="dialogRef"
    v-bind="forwardedAttrs"
    :class="panelStyles({ dense, class: classAttr })"
    :aria-labelledby="ariaLabelledby"
    @close="onNativeClose"
    @cancel="onCancel"
    @click="onBackdropClick"
  >
    <slot />
  </dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const props = defineProps<{
  open?: boolean;
  persistent?: boolean;
  dense?: boolean;
  ariaLabelledby?: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const dialogRef = ref<HTMLDialogElement | null>(null);

watch(
  () => props.open,
  (open) => {
    if (open) {
      dialogRef.value?.showModal();
    } else {
      dialogRef.value?.close();
    }
  }
);

function onCancel(e: Event) {
  if (props.persistent) {
    e.preventDefault();
  }
}

function onNativeClose() {
  emit("close");
}

function onBackdropClick(e: MouseEvent) {
  if (e.target === dialogRef.value && !props.persistent) {
    emit("close");
  }
}

const panelStyles = tv({
  base: [
    "m-auto max-h-[calc(100dvh-2rem)] w-full flex-col rounded-lg border border-neutral-200 bg-white shadow-lg",
    "backdrop:bg-black/50",
    "open:flex",
  ],
  variants: {
    dense: {
      false: "max-w-lg",
      true: "max-w-md",
    },
  },
  defaultVariants: {
    dense: false,
  },
});
</script>
