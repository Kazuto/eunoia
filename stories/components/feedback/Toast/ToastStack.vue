<template>
  <Teleport to="body">
    <div :class="containerStyles({ position })">
      <div
        v-for="(toast, index) in orderedToasts"
        :key="toast.id"
        :style="getStackStyle(index)"
      >
        <Toast :variant="toast.variant" :dense>
          <span class="flex-1">
            {{ toast.message }}
          </span>
          <ToastDismiss
            v-if="toast.dismissible"
            :variant="toast.variant"
            :dense
            :ariaLabel="t('dismiss')"
            @dismiss="dismiss(toast.id)"
          />
          <template #timeout>
            <TimeoutBar v-if="!toast.persistent" :variant="toast.variant" :duration="toast.duration" />
          </template>
        </Toast>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { ref, computed, onBeforeUnmount, toRef } from "vue";
import { tv } from "tailwind-variants";
import { type LocaleMessages, useLocale } from "@/composables/useLocale";
import Toast from "./primitives/Toast.vue";
import ToastDismiss from "./primitives/ToastDismiss.vue";
import TimeoutBar from "@/components/feedback/primitives/TimeoutBar.vue";

interface ToastItem {
  id: number;
  message: string;
  variant: "info" | "success" | "warning" | "danger";
  dismissible: boolean;
  persistent: boolean;
  duration: number;
}

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
  },
);

const t = useLocale("toast", toRef(() => props.locale));

const isBottom = computed(() => props.position.startsWith("bottom"));

const containerStyles = tv({
  base: "fixed z-50 flex gap-2",
  variants: {
    position: {
      "top-left": "left-4 top-4 flex-col",
      "top-center": "left-1/2 top-4 -translate-x-1/2 flex-col",
      "top-right": "right-4 top-4 flex-col",
      "bottom-left": "bottom-4 left-4 flex-col-reverse",
      "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 flex-col-reverse",
      "bottom-right": "bottom-4 right-4 flex-col-reverse",
    },
  },
  defaultVariants: {
    position: "bottom-right",
  },
});

const toasts = ref<ToastItem[]>([]);
const timers = new Map<number, ReturnType<typeof setTimeout>>();
let nextId = 1;

const orderedToasts = computed(() => [...toasts.value]);

const collapsedCount = computed(() =>
  Math.max(0, toasts.value.length - props.limit),
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
  for (const timer of timers.values()) {
    clearTimeout(timer);
  }
  timers.clear();
});

defineExpose({ add, dismiss, dismissAll });
</script>
