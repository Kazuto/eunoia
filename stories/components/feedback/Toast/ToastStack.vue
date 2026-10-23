<template>
  <Teleport :to="target">
    <!-- A manual popover, so toasts show in the top layer above open modal dialogs,
         which no z-index can reach. While a modal dialog is open, the stack moves
         into it: everything outside a modal dialog is inert, popovers included. -->
    <div
      ref="container"
      popover="manual"
      :class="containerStyles({ position })"
    >
      <div
        v-for="(toast, index) in orderedToasts"
        :key="toast.id"
        :style="getStackStyle(index)"
      >
        <Toast
          :variant="toast.variant"
          :dense
        >
          <span class="flex-1">
            {{ toast.message }}
          </span>
          <ToastDismiss
            v-if="toast.dismissible"
            :variant="toast.variant"
            :dense
            :aria-label="t('dismiss')"
            @dismiss="dismiss(toast.id)"
          />
          <template #timeout>
            <TimeoutBar
              v-if="!toast.persistent"
              :variant="toast.variant"
              :duration="toast.duration"
            />
          </template>
        </Toast>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import {
  ref,
  computed,
  onBeforeUnmount,
  onMounted,
  toRef,
  nextTick,
  watch,
} from "vue";
import { tv } from "tailwind-variants";
import { type LocaleMessages, useLocale } from "@/composables";
import Toast from "./primitives/Toast.vue";
import ToastDismiss from "./primitives/ToastDismiss.vue";
import TimeoutBar from "../primitives/TimeoutBar.vue";

export type ToastItem = {
  id: number;
  message: string;
  variant: "info" | "success" | "warning" | "danger";
  dismissible: boolean;
  persistent: boolean;
  duration: number;
};

const props = withDefaults(
  defineProps<{
    position?:
      | "top-left"
      | "top-center"
      | "top-right"
      | "bottom-left"
      | "bottom-center"
      | "bottom-right";
    limit?: number;
    dense?: boolean;
    locale?: LocaleMessages;
  }>(),
  {
    position: "bottom-right",
    limit: 3,
    locale: undefined,
  }
);

const t = useLocale(
  "toast",
  toRef(() => props.locale)
);

const isBottom = computed(() => props.position.startsWith("bottom"));

// The resets undo the browser's popover styles: centered, bordered, with a background.
const containerStyles = tv({
  base: "fixed z-50 m-0 flex gap-2 overflow-visible border-0 bg-transparent p-0",
  variants: {
    position: {
      "top-left": "top-4 right-auto bottom-auto left-4 flex-col",
      "top-center":
        "top-4 right-auto bottom-auto left-1/2 -translate-x-1/2 flex-col",
      "top-right": "top-4 right-4 bottom-auto left-auto flex-col",
      "bottom-left": "top-auto right-auto bottom-4 left-4 flex-col-reverse",
      "bottom-center":
        "top-auto right-auto bottom-4 left-1/2 -translate-x-1/2 flex-col-reverse",
      "bottom-right": "top-auto right-4 bottom-4 left-auto flex-col-reverse",
    },
  },
  defaultVariants: {
    position: "bottom-right",
  },
});

const toasts = ref<ToastItem[]>([]);
const container = ref<HTMLElement>();

// The top layer stacks in the order things were shown, so the stack is shown again
// with each toast to come above dialogs opened since. Without popover support it
// stays a fixed layer.
function raise() {
  const element = container.value;

  if (!element || typeof element.showPopover !== "function") return;

  if (element.matches(":popover-open")) element.hidePopover();

  element.showPopover();
}

// Modal dialogs by the order they opened; the stack lives in the last one.
let openDialogs: HTMLDialogElement[] = [];
const target = ref<string | HTMLElement>("body");
let observer: MutationObserver | undefined;

function isModal(dialog: HTMLDialogElement) {
  try {
    return dialog.matches(":modal");
  } catch {
    return dialog.open;
  }
}

function trackDialogs() {
  const current = Array.from(document.querySelectorAll("dialog")).filter(
    (dialog) => dialog.open && isModal(dialog)
  );

  openDialogs = [
    ...openDialogs.filter((dialog) => current.includes(dialog)),
    ...current.filter((dialog) => !openDialogs.includes(dialog)),
  ];
  target.value = openDialogs.at(-1) ?? "body";
}

onMounted(() => {
  if (typeof MutationObserver === "undefined") return;

  trackDialogs();
  observer = new MutationObserver(trackDialogs);
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["open"],
    childList: true,
    subtree: true,
  });
});

// Moving a shown popover hides it, so it is shown again in its new place.
watch(target, () => {
  if (toasts.value.length) nextTick(raise);
});

watch(
  () => toasts.value.length,
  (count, previous) => {
    const element = container.value;

    if (count > (previous ?? 0)) {
      nextTick(raise);
    } else if (
      count === 0 &&
      element &&
      typeof element.hidePopover === "function" &&
      element.matches(":popover-open")
    ) {
      element.hidePopover();
    }
  }
);

const timers = new Map<number, ReturnType<typeof setTimeout>>();
let nextId = 1;

const orderedToasts = computed(() => [...toasts.value]);

const collapsedCount = computed(() =>
  Math.max(0, toasts.value.length - props.limit)
);

function getStackStyle(index: number): Record<string, string> {
  const collapsed = collapsedCount.value;

  // Toasts are ordered oldest-first in the array.
  // For bottom positions (flex-col-reverse), the array renders bottom-up,
  // so index 0 (oldest) is at the top visually.
  // For top positions (flex-col), index 0 (oldest) is at the top visually.

  // Visible toasts are the newest `limit` items (tail of the array).
  if (index >= collapsed) {
    return {};
  }

  // Peeking positions: count from the collapse boundary inward
  const peekIndex = collapsed - 1 - index;

  if (peekIndex === 0) {
    // peek-1: closest to visible stack
    return {
      transform: "scale(0.95)",
      opacity: "0.7",
      [isBottom.value ? "marginBottom" : "marginTop"]: "-28px",
      pointerEvents: "none",
    };
  }

  if (peekIndex === 1) {
    // peek-2: further from visible stack
    return {
      transform: "scale(0.90)",
      opacity: "0.4",
      [isBottom.value ? "marginBottom" : "marginTop"]: "-32px",
      pointerEvents: "none",
    };
  }

  // Rest are hidden
  return {
    display: "none",
  };
}

function add(options: {
  message: string;
  variant?: "info" | "success" | "warning" | "danger";
  dismissible?: boolean;
  persistent?: boolean;
  duration?: number;
}): number {
  const id = nextId++;
  const toast: ToastItem = {
    id,
    message: options.message,
    variant: options.variant ?? "info",
    dismissible: options.dismissible ?? true,
    persistent: options.persistent ?? false,
    duration: options.duration ?? 5000,
  };

  toasts.value.push(toast);

  if (!toast.persistent && toast.duration > 0) {
    const timer = setTimeout(() => dismiss(id), toast.duration);
    timers.set(id, timer);
  }

  return id;
}

function dismiss(id: number) {
  const timer = timers.get(id);
  if (timer != null) {
    clearTimeout(timer);
    timers.delete(id);
  }
  toasts.value = toasts.value.filter((t) => t.id !== id);
}

function dismissAll() {
  for (const timer of timers.values()) {
    clearTimeout(timer);
  }
  timers.clear();
  toasts.value = [];
}

onBeforeUnmount(() => {
  observer?.disconnect();

  for (const timer of timers.values()) {
    clearTimeout(timer);
  }
  timers.clear();
});

defineExpose({ add, dismiss, dismissAll });
</script>
