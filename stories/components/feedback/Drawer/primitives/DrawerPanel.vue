<template>
  <dialog
    ref="dialogRef"
    v-bind="forwardedAttrs"
    :class="panelStyles({ side, dense, class: classAttr })"
    :aria-labelledby="ariaLabelledby"
    @close="onNativeClose"
    @cancel="onCancel"
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

export type DrawerSide = "left" | "right" | "top" | "bottom";

const props = withDefaults(
  defineProps<{
    open?: boolean;
    side?: DrawerSide;
    persistent?: boolean;
    dense?: boolean;
    ariaLabelledby?: string;
  }>(),
  {
    side: "right",
    ariaLabelledby: undefined,
  }
);

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

// Only report closes the parent did not ask for (Escape), so closing via `open` doesn't echo back.
function onNativeClose() {
  if (props.open) emit("close");
}

function onBackdropClick(e: MouseEvent) {
  if (e.target === dialogRef.value && !props.persistent) {
    emit("close");
  }
}

const panelStyles = tv({
  base: [
    "fixed m-0 max-h-none max-w-none flex-col overflow-hidden border p-0 shadow-lg squircle",
    "border-neutral-200 bg-white",
    "dark:border-neutral-700 dark:bg-neutral-900",
    "backdrop:bg-black/50",
    "open:flex",
    "transition-[translate,overlay,display] transition-discrete duration-300 ease-out",
    "motion-reduce:transition-none",
  ],
  variants: {
    side: {
      right: [
        "inset-y-0 right-0 left-auto h-dvh w-[min(24rem,100vw)] rounded-l-[24px] border-r-0",
        "translate-x-full open:translate-x-0 starting:open:translate-x-full",
      ],
      left: [
        "inset-y-0 right-auto left-0 h-dvh w-[min(24rem,100vw)] rounded-r-[24px] border-l-0",
        "-translate-x-full open:translate-x-0 starting:open:-translate-x-full",
      ],
      top: [
        "inset-x-0 top-0 bottom-auto max-h-[80dvh] w-full rounded-b-[24px] border-t-0",
        "-translate-y-full open:translate-y-0 starting:open:-translate-y-full",
      ],
      bottom: [
        "inset-x-0 top-auto bottom-0 max-h-[80dvh] w-full rounded-t-[24px] border-b-0",
        "translate-y-full open:translate-y-0 starting:open:translate-y-full",
      ],
    },
    dense: {
      false: "",
      true: "",
    },
  },
  compoundVariants: [
    {
      side: ["left", "right"],
      dense: true,
      class: "w-[min(20rem,100vw)]",
    },
  ],
  defaultVariants: {
    side: "right",
    dense: false,
  },
});
</script>
