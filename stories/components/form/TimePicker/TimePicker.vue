<template>
  <div
    ref="containerRef"
    class="relative flex flex-col gap-1"
    @focusout="onFocusOut"
  >
    <Label
      v-if="hasDefaultSlot"
      :id="labelId"
      :for="triggerId"
      :dense
    >
      <slot />
    </Label>
    <TimePickerTrigger
      v-bind="$attrs"
      :id="triggerId"
      ref="triggerRef"
      :value-id="valueId"
      :display-value="displayValue"
      :placeholder="placeholder ?? t('placeholder')"
      :dense
      :invalid
      :disabled
      :is-open="isOpen"
      :panel-id="panelId"
      :clear-label="t('clear-selection')"
      :aria-label="ariaLabel"
      :aria-labelledby="
        ariaLabelledby ?? (hasDefaultSlot ? `${labelId} ${valueId}` : undefined)
      "
      @toggle="togglePanel"
      @keydown="handleTriggerKeydown"
      @clear="clear"
    />
    <Teleport
      :to="teleportTarget ?? 'body'"
      :disabled="!teleportTo"
    >
      <TimePickerPanel
        v-if="isOpen"
        :id="panelId"
        ref="panelRef"
        :aria-label="t('label')"
        :dense
        :placement="teleportTo ? undefined : panelPlacement"
        :floating="!!teleportTo"
        :style="teleportTo ? floatingStyles : undefined"
        @keydown="handlePanelKeydown"
        @focusout="onFocusOut"
      >
        <TimePickerColumn
          v-for="column in columns"
          :id="`${panelId}-${column.key}`"
          :key="column.key"
          :label="column.label"
          :items="column.items"
          :selected="column.selected"
          :dense
          @select="(value) => handleSelect(column.key, value)"
          @commit="commit"
        />
      </TimePickerPanel>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, toRef, watch } from "vue";
import { autoUpdate, flip, offset, shift, useFloating } from "@floating-ui/vue";
import {
  type LocaleMessages,
  useLocale,
  useSanitizedId,
  useSlotContent,
} from "@/composables";
import Label from "../Input/primitives/Label.vue";
import TimePickerTrigger from "./primitives/TimePickerTrigger.vue";
import TimePickerPanel from "./primitives/TimePickerPanel.vue";
import TimePickerColumn, {
  type TimePickerColumnItem,
} from "./primitives/TimePickerColumn.vue";
import {
  dayPeriodLabels,
  formatTime,
  padTime,
  parseTime,
  serializeTime,
} from "./primitives/time";

type ColumnKey = "hours" | "minutes" | "seconds" | "period";

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    /** Include a seconds column; the model becomes "HH:mm:ss". */
    seconds?: boolean;
    /** Minute increment shown in the minutes column. */
    step?: number;
    /** Display 12-hour time with an AM/PM column. The model stays 24-hour. */
    hour12?: boolean;
    dense?: boolean;
    invalid?: boolean;
    disabled?: boolean;
    placeholder?: string;
    ariaLabel?: string;
    ariaLabelledby?: string;
    locale?: LocaleMessages;
    /** Teleport outside overflow containers. Native dialogs own their panels. */
    teleportTo?: string | HTMLElement;
  }>(),
  {
    step: 1,
    placeholder: undefined,
    ariaLabel: undefined,
    ariaLabelledby: undefined,
    locale: undefined,
    teleportTo: undefined,
  }
);

const model = defineModel<string | null>();

const { hasSlotContent } = useSlotContent();
const hasDefaultSlot = hasSlotContent("default");

const t = useLocale(
  "timepicker",
  toRef(() => props.locale)
);

const labelId = useSanitizedId("timepicker-label");
const triggerId = useSanitizedId("timepicker-trigger");
const valueId = useSanitizedId("timepicker-value");
const panelId = useSanitizedId("timepicker-panel");

const isOpen = ref(false);
const containerRef = ref<HTMLElement | null>(null);
const triggerRef = ref<InstanceType<typeof TimePickerTrigger> | null>(null);
const panelRef = ref<InstanceType<typeof TimePickerPanel> | null>(null);
const triggerElement = computed<HTMLElement | null>(
  () => triggerRef.value?.$el ?? null
);
const panelElement = computed<HTMLElement | null>(
  () => panelRef.value?.$el ?? null
);
const teleportTarget = ref<string | HTMLElement>();
const panelPlacement = ref<"top" | "bottom">("bottom");

const { floatingStyles } = useFloating(triggerElement, panelElement, {
  open: isOpen,
  placement: "bottom-start",
  strategy: "fixed",
  middleware: computed(() =>
    props.teleportTo ? [offset(4), flip(), shift({ padding: 8 })] : []
  ),
  whileElementsMounted(reference, floating, update) {
    if (props.teleportTo) return autoUpdate(reference, floating, update);
    return () => {};
  },
});

const parts = computed(() => parseTime(model.value));

const displayValue = computed(() =>
  parts.value
    ? formatTime(parts.value, { seconds: props.seconds, hour12: props.hour12 })
    : ""
);

const minuteStep = computed(() =>
  Math.min(59, Math.max(1, Math.floor(props.step)))
);

function range(count: number, increment = 1): TimePickerColumnItem[] {
  return Array.from({ length: Math.ceil(count / increment) }, (_, i) => ({
    value: i * increment,
    label: padTime(i * increment),
  }));
}

const columns = computed(() => {
  const current = parts.value;
  const result: Array<{
    key: ColumnKey;
    label: string;
    items: TimePickerColumnItem[];
    selected: number | undefined;
  }> = [
    {
      key: "hours",
      label: t("hours"),
      items: props.hour12
        ? [12, ...Array.from({ length: 11 }, (_, i) => i + 1)].map((h) => ({
            value: h,
            label: String(h),
          }))
        : range(24),
      selected: current
        ? props.hour12
          ? current.hours % 12 || 12
          : current.hours
        : undefined,
    },
    {
      key: "minutes",
      label: t("minutes"),
      items: range(60, minuteStep.value),
      selected: current?.minutes,
    },
  ];

  if (props.seconds) {
    result.push({
      key: "seconds",
      label: t("seconds"),
      items: range(60),
      selected: current?.seconds,
    });
  }

  if (props.hour12) {
    const [am, pm] = dayPeriodLabels();
    result.push({
      key: "period",
      label: `${am}/${pm}`,
      items: [
        { value: 0, label: am },
        { value: 1, label: pm },
      ],
      selected: current ? (current.hours >= 12 ? 1 : 0) : undefined,
    });
  }

  return result;
});

function handleSelect(key: ColumnKey, value: number) {
  const current = parts.value ?? { hours: 0, minutes: 0, seconds: 0 };
  const next = { ...current };
  const isPm = current.hours >= 12;

  if (key === "hours") {
    next.hours = props.hour12 ? (value % 12) + (isPm ? 12 : 0) : value;
  } else if (key === "minutes") {
    next.minutes = value;
  } else if (key === "seconds") {
    next.seconds = value;
  } else {
    next.hours = (current.hours % 12) + (value === 1 ? 12 : 0);
  }

  model.value = serializeTime(next, props.seconds);
}

async function openPanel() {
  if (props.disabled || isOpen.value) return;

  // A body portal is inert beneath showModal(). Keep the panel in the
  // dialog's top layer, but outside its scrolling body.
  teleportTarget.value =
    triggerElement.value?.closest("dialog") ?? props.teleportTo;
  isOpen.value = true;

  await nextTick();

  if (!props.teleportTo) updatePlacement();
  panelElement.value
    ?.querySelector<HTMLElement>("[role='listbox']")
    ?.focus({ preventScroll: true });
}

function updatePlacement() {
  if (!containerRef.value) return;

  const rect = containerRef.value.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;
  const panelHeight = panelElement.value?.offsetHeight ?? 240;

  panelPlacement.value =
    spaceBelow >= panelHeight || spaceBelow >= spaceAbove ? "bottom" : "top";
}

function closePanel() {
  isOpen.value = false;
}

function togglePanel() {
  if (isOpen.value) {
    closePanel();
  } else {
    openPanel();
  }
}

function commit() {
  closePanel();
  triggerRef.value?.focus();
}

function clear() {
  model.value = null;
  closePanel();
  triggerRef.value?.focus();
}

function handleTriggerKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      openPanel();
      break;

    case "Escape":
      if (isOpen.value) {
        event.preventDefault();
        event.stopPropagation();
        closePanel();
      }
      break;
  }
}

function handlePanelKeydown(event: KeyboardEvent) {
  if (event.key !== "Escape") return;
  event.preventDefault();
  event.stopPropagation();
  commit();
}

function onFocusOut(event: FocusEvent) {
  const next = event.relatedTarget as Node | null;
  // Clicks on non-focusable elements are handled by onClickOutside.
  if (!next) return;
  if (containerRef.value?.contains(next)) return;
  if (panelElement.value?.contains(next)) return;
  closePanel();
}

function onClickOutside(event: MouseEvent) {
  const path = event.composedPath();
  if (
    !path.includes(containerRef.value as EventTarget) &&
    !path.includes(panelElement.value as EventTarget)
  ) {
    closePanel();
  }
}

watch(isOpen, (open, _, onCleanup) => {
  if (open) {
    document.addEventListener("mousedown", onClickOutside);
    const dialog = triggerElement.value?.closest("dialog");
    dialog?.addEventListener("close", closePanel);
    onCleanup(() => {
      document.removeEventListener("mousedown", onClickOutside);
      dialog?.removeEventListener("close", closePanel);
    });
  }
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", onClickOutside);
});
</script>
