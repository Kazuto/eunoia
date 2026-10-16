<template>
  <div
    ref="containerRef"
    class="relative flex flex-col gap-1"
    @focusout="onFocusOut"
  >
    <Label
      v-if="hasDefaultSlot"
      :dense
      :for="inputId"
    >
      <slot />
    </Label>
    <DatePickerTrigger
      v-bind="$attrs"
      :id="inputId"
      ref="triggerRef"
      :mode="mode"
      :selected-dates="selectedDates"
      :dense
      :invalid
      :disabled
      :placeholder="placeholder ?? t('placeholder')"
      :is-open="isOpen"
      :calendar-id="calendarId"
      :aria-label="ariaLabel"
      :aria-labelledby="ariaLabelledby"
      :style="anchorStyle"
      @toggle="toggleCalendar"
      @keydown="handleTriggerKeydown"
      @remove-date="removeDate"
    />
    <Teleport
      :to="teleportTarget ?? 'body'"
      :disabled="!teleportTo"
    >
      <DatePickerCalendar
        v-if="isOpen"
        :id="calendarId"
        ref="calendarRef"
        :mode="mode"
        :selected-dates="selectedDates"
        :current-month="currentMonth"
        :current-year="currentYear"
        :anchor-name="teleportTo ? undefined : anchorName"
        :placement="teleportTo ? undefined : calendarPlacement"
        :floating="!!teleportTo"
        :style="teleportTo ? floatingStyles : undefined"
        :first-day-of-week="firstDayOfWeek"
        :dense
        @select="handleDateSelect"
        @navigate="handleNavigate"
      />
    </Teleport>
    <InputHintRow
      v-if="hasHelper || maxlength"
      :dense
    >
      <InputHelper v-if="hasHelper">
        {{ helper }}
      </InputHelper>
    </InputHintRow>
    <InputError
      v-if="errors?.length"
      :errors="errors"
      :dense
    />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, toRef, watch } from "vue";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
} from "@floating-ui/vue";
import { type LocaleMessages, useLocale, useSanitizedId } from "@/composables";
import { Weekday } from "@/types";
import Label from "../Input/primitives/Label.vue";
import InputHintRow from "../Input/primitives/InputHintRow.vue";
import InputHelper from "../Input/primitives/InputHelper.vue";
import InputError from "../Input/primitives/InputError.vue";
import DatePickerTrigger from "./primitives/DatePickerTrigger.vue";
import DatePickerCalendar from "./primitives/DatePickerCalendar.vue";
import { useSlotContent } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    mode?: "single" | "range";
    dense?: boolean;
    invalid?: boolean;
    disabled?: boolean;
    placeholder?: string;
    ariaLabel?: string;
    ariaLabelledby?: string;
    helper?: string;
    errors?: string[];
    locale?: LocaleMessages;
    placement?: "top" | "bottom";
    firstDayOfWeek?: Weekday;
    /** Teleport outside overflow containers. Native dialogs own their calendars. */
    teleportTo?: string | HTMLElement;
  }>(),
  {
    mode: "single",
    placeholder: undefined,
    ariaLabel: undefined,
    ariaLabelledby: undefined,
    locale: undefined,
    helper: undefined,
    errors: undefined,
    placement: undefined,
    firstDayOfWeek: undefined,
    teleportTo: undefined,
  }
);

const model = defineModel<Date | { start: Date; end: Date } | null>({
  required: false,
});

const { hasSlotContent } = useSlotContent();
const hasDefaultSlot = hasSlotContent("default");

const t = useLocale(
  "datepicker",
  toRef(() => props.locale)
);

const inputId = useSanitizedId("datepicker-input");
const calendarId = useSanitizedId("datepicker-calendar");

const anchorName = `--${inputId}`;
const anchorStyle = { "anchor-name": anchorName } as Record<string, string>;

const isOpen = ref(false);
const containerRef = ref<HTMLElement | null>(null);
const triggerRef = ref<InstanceType<typeof DatePickerTrigger> | null>(null);
const calendarRef = ref<InstanceType<typeof DatePickerCalendar> | null>(null);
const triggerElement = computed<HTMLElement | null>(
  () => triggerRef.value?.$el ?? null
);
const calendarElement = computed<HTMLElement | null>(
  () => calendarRef.value?.$el ?? null
);
const teleportTarget = ref<string | HTMLElement>();
const calendarPlacement = ref<"top" | "bottom">(props.placement ?? "bottom");
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());

const { floatingStyles } = useFloating(triggerElement, calendarElement, {
  open: isOpen,
  placement: "bottom-start",
  strategy: "fixed",
  middleware: computed(() =>
    props.teleportTo
      ? [
          offset(4),
          flip(),
          shift({ padding: 8 }),
          size({
            padding: 8,
            apply({ rects, availableHeight, elements }) {
              Object.assign(elements.floating.style, {
                width: `${rects.reference.width}px`,
                maxHeight: `${Math.max(0, Math.min(400, availableHeight))}px`,
              });
            },
          }),
        ]
      : []
  ),
  whileElementsMounted(reference, floating, update) {
    if (props.teleportTo) return autoUpdate(reference, floating, update);
    return () => {};
  },
});

// Format dates for display
const formatDate = (date: Date): string => {
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const selectedDates = computed<string[]>(() => {
  if (!model.value) return [];

  if (props.mode === "single") {
    if (model.value instanceof Date) {
      return [formatDate(model.value)];
    }
    return [];
  } else {
    if (
      model.value &&
      typeof model.value === "object" &&
      "start" in model.value
    ) {
      const start = formatDate(model.value.start);
      const end = formatDate(model.value.end);
      return [start, end];
    }
    return [];
  }
});

const hasHelper = computed(() => props.helper && !props.errors?.length);

const maxlength = computed(() => undefined); // DatePickers don't typically have maxlength

async function openCalendar() {
  if (props.disabled) return;

  // A body portal is inert beneath showModal(). Keep the calendar in the
  // dialog's top layer, but outside its scrolling body.
  teleportTarget.value =
    triggerElement.value?.closest("dialog") ?? props.teleportTo;
  isOpen.value = true;

  await nextTick();

  if (!props.teleportTo) updateCalendarPlacement();
}

function updateCalendarPlacement() {
  if (!containerRef.value) return;

  const rect = containerRef.value.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;

  const calendarEl = containerRef.value.querySelector(
    "[data-datepicker-calendar]"
  ) as HTMLElement | null;

  const calendarHeight = calendarEl?.offsetHeight ?? 400;

  calendarPlacement.value =
    spaceBelow >= calendarHeight || spaceBelow >= spaceAbove ? "bottom" : "top";
}

function closeCalendar() {
  isOpen.value = false;
}

function toggleCalendar() {
  isOpen.value = !isOpen.value;
}

function handleDateSelect(payload: { date: Date; edge?: "start" | "end" }) {
  const { date, edge } = payload;

  if (props.mode === "single") {
    model.value = date;
    return;
  }

  // --- initialize range ---
  if (
    !model.value ||
    !(typeof model.value === "object" && "start" in model.value)
  ) {
    model.value = { start: date, end: date };
    return;
  }

  const start = model.value.start;
  const end = model.value.end;

  // --- DRAGGING: force which edge moves ---
  if (edge === "start") {
    model.value = { start: date, end };
  } else if (edge === "end") {
    model.value = { start, end: date };
  }

  // --- NORMAL CLICK ---
  else if (date < start) {
    model.value = { start: date, end };
  } else if (date > end) {
    model.value = { start, end: date };
  } else {
    // inside range → move closest boundary
    const d = stripTime(date);
    const s = stripTime(start);
    const e = stripTime(end);

    const distToStart = Math.abs(d - s);
    const distToEnd = Math.abs(d - e);

    if (distToStart <= distToEnd) {
      model.value = { start: date, end };
    } else {
      model.value = { start, end: date };
    }
  }

  // --- keep range ordered ---
  if (model.value.start > model.value.end) {
    [model.value.start, model.value.end] = [model.value.end, model.value.start];
  }
}

function removeDate(index: number) {
  if (props.mode === "single") {
    model.value = null;
  } else {
    if (
      model.value &&
      typeof model.value === "object" &&
      "start" in model.value
    ) {
      if (index === 0) {
        model.value = { start: model.value.end, end: model.value.end };
      } else if (index === 1) {
        model.value = { start: model.value.start, end: model.value.start };
      }
    }
  }
}

function stripTime(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function handleNavigate(
  direction: "prev" | "next" | "month" | "year",
  value?: number
) {
  if (direction === "prev") {
    if (currentMonth.value === 0) {
      currentMonth.value = 11;
      currentYear.value--;
    } else {
      currentMonth.value--;
    }
  } else if (direction === "next") {
    if (currentMonth.value === 11) {
      currentMonth.value = 0;
      currentYear.value++;
    } else {
      currentMonth.value++;
    }
  } else if (direction === "month" && value !== undefined) {
    currentMonth.value = value;
  } else if (direction === "year" && value !== undefined) {
    currentYear.value = value;
  }
}

function handleTriggerKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      if (!isOpen.value) {
        openCalendar();
      }
      break;

    case "Enter":
    case " ":
      event.preventDefault();
      toggleCalendar();
      break;

    case "Escape":
      event.preventDefault();
      closeCalendar();
      break;

    case "Tab":
      closeCalendar();
      break;
  }
}

function onFocusOut(event: FocusEvent) {
  // Don't close if focus is moving to nothing (clicking on non-focusable element)
  if (!event.relatedTarget) return;

  // Don't close if focus is staying within the container
  if (containerRef.value?.contains(event.relatedTarget as Node)) return;

  closeCalendar();
}

function onClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;

  // Check if clicked element or any ancestor has the calendar data attribute
  // (This handles cases where the calendar might be portaled/positioned outside)
  if (target.closest?.("[data-datepicker-calendar]")) {
    return;
  }

  // Don't close if clicking inside the trigger or container
  if (containerRef.value?.contains(target)) return;

  closeCalendar();
}

watch(isOpen, (open) => {
  if (open) {
    document.addEventListener("mousedown", onClickOutside);
  } else {
    document.removeEventListener("mousedown", onClickOutside);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", onClickOutside);
});
</script>
