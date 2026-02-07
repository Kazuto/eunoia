<template>
  <Alert
    v-if="isVisible"
    v-bind="$attrs"
    :variant
    :dense
  >
    <span class="flex-1">
      <slot />
    </span>
    <AlertDismiss
      v-if="dismissible"
      :variant
      :dense
      :ariaLabel="t('dismiss')"
      @dismiss="dismiss"
    />
  </Alert>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch, toRef } from "vue";
import { type LocaleMessages, useLocale } from "@/composables/useLocale";
import Alert from "./primitives/Alert.vue";
import AlertDismiss from "./primitives/AlertDismiss.vue";

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
    locale?: LocaleMessages;
  }>(),
  {
    duration: 5000,
  },
);

const t = useLocale("alert", toRef(() => props.locale));

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
