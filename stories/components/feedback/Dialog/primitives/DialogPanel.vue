<template>
  <dialog
    ref="dialogRef"
    v-bind="forwardedAttrs"
    :class="panelStyles({ dense, class: classAttr })"
    :aria-labelledby="ariaLabelledby"
    @close="onNativeClose"
    @cancel="onCancel"
    @keydown.esc="onEscape"
    @pointerdown="onPointerdown"
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
  persistent?: boolean;
  dense?: boolean;
  ariaLabelledby?: string;
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

function onCancel(e: Event) {
  if (props.persistent) {
    e.preventDefault();
  }
}

// Chrome stops letting `cancel` be prevented after repeated Escapes without user activation,
// so a persistent dialog also blocks the key itself.
function onEscape(e: KeyboardEvent) {
  if (props.persistent) {
    e.preventDefault();
  }
}

// Only report closes the parent did not ask for (Escape), so closing via `open` doesn't echo back.
function onNativeClose() {
  if (props.open) emit("close");
}

// Only a press that also started on the backdrop counts, so a text selection
// dragged out of the dialog doesn't close it.
let pressedBackdrop = false;

function onPointerdown(e: PointerEvent) {
  pressedBackdrop = e.target === dialogRef.value;
}

function onBackdropClick(e: MouseEvent) {
  const fromBackdrop = pressedBackdrop;
  pressedBackdrop = false;
  if (fromBackdrop && e.target === dialogRef.value && !props.persistent) {
    emit("close");
  }
}

const panelStyles = tv({
  base: [
    "m-auto max-h-[calc(100dvh-2rem)] w-full flex-col overflow-hidden rounded-[24px] border shadow-lg squircle",
    "border-neutral-200 bg-white",
    "dark:border-neutral-700 dark:bg-neutral-900",
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
