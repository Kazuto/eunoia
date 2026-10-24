<template>
  <dialog
    ref="dialogRef"
    v-bind="forwardedAttrs"
    :class="panelStyles({ dense, class: classAttr })"
    @close="onNativeClose"
    @click="onBackdropClick"
  >
    <slot />
  </dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const props = defineProps<{
  open?: boolean;
  dense?: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const dialogRef = ref<HTMLDialogElement | null>(null);

function sync(open: boolean) {
  const el = dialogRef.value;
  if (!el) return;
  if (open && !el.open) el.showModal();
  else if (!open && el.open) el.close();
}

watch(() => props.open, sync);
onMounted(() => sync(props.open));

function onNativeClose() {
  if (props.open) emit("close");
}

function onBackdropClick(e: MouseEvent) {
  if (e.target === dialogRef.value) emit("close");
}

const panelStyles = tv({
  base: [
    "mx-auto mt-[12dvh] mb-auto max-h-[min(32rem,76dvh)] w-[calc(100%-2rem)] flex-col overflow-hidden rounded-[24px] border p-0 shadow-lg squircle",
    "border-neutral-200 bg-white",
    "dark:border-neutral-700 dark:bg-neutral-900",
    "backdrop:bg-black/50",
    "open:flex",
  ],
  variants: {
    dense: {
      false: "max-w-xl",
      true: "max-w-lg",
    },
  },
  defaultVariants: {
    dense: false,
  },
});
</script>
