<template>
  <Teleport to="body">
    <div
      v-if="isVisible"
      :class="positionStyles({ position })"
    >
      <Toast v-bind="$attrs" :variant :dense>
        <span class="flex-1">
          <slot />
        </span>
        <ToastDismiss
          v-if="dismissible"
          :variant
          :dense
          :ariaLabel="t('dismiss')"
          @dismiss="dismiss"
        />
        <template #timeout>
          <TimeoutBar v-if="!persistent" :variant :duration />
        </template>
      </Toast>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch, toRef } from "vue";
import { tv } from "tailwind-variants";
import { type LocaleMessages, useLocale } from "@/composables/useLocale";
import Toast from "./primitives/Toast.vue";
import ToastDismiss from "./primitives/ToastDismiss.vue";
import TimeoutBar from "@/components/feedback/primitives/TimeoutBar.vue";

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    variant?: "info" | "success" | "warning" | "danger";
    dense?: boolean;
    dismissible?: boolean;
    persistent?: boolean;
    duration?: number;
    position?:
      | "top-left"
      | "top-center"
      | "top-right"
      | "bottom-left"
      | "bottom-center"
      | "bottom-right";
    locale?: LocaleMessages;
  }>(),
  {
    duration: 5000,
  },
);

const t = useLocale("toast", toRef(() => props.locale));

const positionStyles = tv({
  base: "fixed z-50",
  variants: {
    position: {
      "top-left": "left-4 top-4",
      "top-center": "left-1/2 top-4 -translate-x-1/2",
      "top-right": "right-4 top-4",
      "bottom-left": "bottom-4 left-4",
      "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
      "bottom-right": "bottom-4 right-4",
    },
  },
  defaultVariants: {
    position: "bottom-right",
  },
});

const emit = defineEmits<{
  (e: "dismiss"): void;
}>();

const isVisible = ref(true);
let timer: ReturnType<typeof setTimeout> | null = null;

function dismiss() {
  isVisible.value = false;
  emit("dismiss");
}

function startTimer() {
  clearTimer();
  if (!props.persistent && props.duration > 0) {
    timer = setTimeout(dismiss, props.duration);
  }
}

function clearTimer() {
  if (timer != null) {
    clearTimeout(timer);
    timer = null;
  }
}

watch(
  () => props.persistent,
  (persistent) => {
    if (persistent) {
      clearTimer();
    } else {
      startTimer();
    }
  },
);

onMounted(() => {
  if (!props.persistent) {
    startTimer();
  }
});

onBeforeUnmount(() => {
  clearTimer();
});
</script>
