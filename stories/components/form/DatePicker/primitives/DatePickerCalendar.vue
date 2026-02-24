<template>
  <div
    :id="id"
    :class="calendarStyles({ placement, dense, class: classAttr })"
    v-bind="forwardedAttrs"
    role="dialog"
    aria-modal="true"
    :aria-label="t('label')"
    :style="positionStyle"
  >
    <!-- Calendar Header -->
    <div class="mb-2 flex items-center justify-between gap-1">
      <Button
        ghost
        icon="caret-left"
        :dense
        :aria-label="t('previous-month')"
        @click="() => $emit('navigate', 'prev')"
      />

      <div class="flex items-center gap-1">
        <Select
          v-model="currentMonth"
          class="w-32 shrink-0"
          :dense
          :aria-label="t('select-month')"
          :options="months"
          :placeholder="t('select-month')"
          @update:model-value="(event) => $emit('navigate', 'month', event)"
        />

        <Select
          v-model="currentYear"
          class="w-24 shrink-0"
          :dense
          :aria-label="t('select-year')"
          :options="years"
          :placeholder="t('select-year')"
          @update:model-value="(event) => $emit('navigate', 'year', event)"
        />
      </div>

      <Button
        ghost
        icon="caret-right"
        :dense
        :aria-label="t('next-month')"
        @click="() => $emit('navigate', 'next')"
      />
    </div>

    <!-- Weekday Headers -->
    <div class="mb-1 grid grid-cols-7">
      <div
        v-for="day in weekdays"
        :key="day"
        :class="weekdayStyles({ dense })"
      >
        {{ day }}
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="grid grid-cols-7 place-items-center gap-y-3">
      <!-- Empty cells for days before the first of the month -->
      <button
        v-for="day in prevMonthDays"
        :key="`prev-${day}`"
        type="button"
        :class="[
          dayStyles({
            dense,
            isSelected: isDaySelectedDate(getPrevMonthDateObject(day)),
            isInRange: isDayInRangeDate(getPrevMonthDateObject(day)),
            isRangeStart: isRangeStartDate(getPrevMonthDateObject(day)),
            isRangeEnd: isRangeEndDate(getPrevMonthDateObject(day)),
            isToday: false,
          }),
          'opacity-40',
          isRangeStartDate(getPrevMonthDateObject(day)) ||
          isRangeEndDate(getPrevMonthDateObject(day))
            ? 'cursor-move'
            : '',
        ]"
        :aria-label="`${t('select-day')} ${day} ${months[prevMonthIndex].label} ${prevMonthYear}`"
        @click="selectPrevMonthDay(day)"
        @mousedown="startDrag(getPrevMonthDateObject(day))"
        @mouseenter="dragOver(getPrevMonthDateObject(day))"
        @mouseup="endDrag"
      >
        {{ day }}
      </button>

      <!-- Day cells -->
      <button
        v-for="day in daysInMonth"
        :key="day"
        type="button"
        :class="[
          dayStyles({
            dense,
            isSelected: isDaySelectedDate(getDateObject(day)),
            isInRange: isDayInRangeDate(getDateObject(day)),
            isRangeStart: isRangeStartDate(getDateObject(day)),
            isRangeEnd: isRangeEndDate(getDateObject(day)),
            isToday: isToday(day),
          }),
          isRangeStartDate(getDateObject(day)) ||
          isRangeEndDate(getDateObject(day))
            ? 'cursor-move'
            : '',
        ]"
        :aria-label="`${t('select-day')} ${day} ${months[currentMonth].label} ${currentYear}`"
        @click="selectDay(day)"
        @mousedown="startDrag(getDateObject(day))"
        @mouseenter="dragOver(getDateObject(day))"
        @mouseup="endDrag"
      >
        {{ day }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { tv } from "tailwind-variants";
import { useForwardedAttrs } from "@/composables";
import { useLocale } from "@/composables/useLocale";
import { Button, Select } from "@/components";
import { Weekday } from "@/types";

const currentMonth = defineModel<number>("currentMonth", { default: 0 });
const currentYear = defineModel<number>("currentYear", { default: 0 });

const props = defineProps<{
  id?: string;
  mode: "single" | "range";
  selectedDates: string[];
  dense?: boolean;
  anchorName: string;
  placement?: "top" | "bottom";
  firstDayOfWeek?: Weekday;
}>();

const emit = defineEmits<{
  (e: "select", payload: { date: Date; edge?: "start" | "end" }): void;
  (
    e: "navigate",
    direction: "prev" | "next" | "month" | "year",
    value?: number
  ): void;
}>();

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const t = useLocale("datepicker");

// Weekdays and months for display
// Full week in JS order (Sunday = 0)
const allWeekdays = [
  t("weekdays_short.sunday"),
  t("weekdays_short.monday"),
  t("weekdays_short.tuesday"),
  t("weekdays_short.wednesday"),
  t("weekdays_short.thursday"),
  t("weekdays_short.friday"),
  t("weekdays_short.saturday"),
];

const fdow = computed(() => props.firstDayOfWeek ?? 1);

const weekdays = computed(() => [
  ...allWeekdays.slice(fdow.value),
  ...allWeekdays.slice(0, fdow.value),
]);

const months = [
  { value: 0, label: t("months.january") },
  { value: 1, label: t("months.february") },
  { value: 2, label: t("months.march") },
  { value: 3, label: t("months.april") },
  { value: 4, label: t("months.may") },
  { value: 5, label: t("months.june") },
  { value: 6, label: t("months.july") },
  { value: 7, label: t("months.august") },
  { value: 8, label: t("months.september") },
  { value: 9, label: t("months.october") },
  { value: 10, label: t("months.november") },
  { value: 11, label: t("months.december") },
];

const isDragging = ref(false);
const draggingEdge = ref<"start" | "end" | null>(null);

window.addEventListener("mouseup", () => {
  isDragging.value = false;
  draggingEdge.value = null;
});

const startDrag = (date: Date) => {
  if (props.mode !== "range") return;

  const start = selectedStartDate();
  const end = selectedEndDate();

  if (!start || !end) return;

  if (sameDay(date, start)) {
    draggingEdge.value = "start";
  } else if (sameDay(date, end)) {
    draggingEdge.value = "end";
  } else {
    return; // only drag from edges
  }

  isDragging.value = true;
};

const dragOver = (date: Date) => {
  if (!isDragging.value || !draggingEdge.value) return;

  emit("select", { date, edge: draggingEdge.value });
};

const endDrag = () => {
  isDragging.value = false;
  draggingEdge.value = null;
};

const prevMonthIndex = computed(() => (props.currentMonth + 11) % 12);
const prevMonthYear = computed(() =>
  props.currentMonth === 0 ? props.currentYear - 1 : props.currentYear
);

// Generate years for the select dropdown (10 years before and after current year)
const years = computed(() => {
  const current = new Date().getFullYear();

  return Array.from({ length: 21 }, (_, i) => current - 10 + i).map((year) => ({
    value: year,
    label: year.toString(),
  }));
});

// Calculate days in month
const daysInMonth = computed(() => {
  return new Date(props.currentYear, props.currentMonth + 1, 0).getDate();
});

const daysInPrevMonth = computed(() => {
  return new Date(props.currentYear, props.currentMonth, 0).getDate();
});

const prevMonthDays = computed(() => {
  const count = firstWeekdayIndex.value;
  const total = daysInPrevMonth.value;

  return Array.from({ length: count }, (_, i) => total - count + i + 1);
});

const firstWeekdayIndex = computed(() => {
  const jsDay = new Date(props.currentYear, props.currentMonth, 1).getDay();
  return (jsDay - fdow.value + 7) % 7;
});

// Helper functions for date comparisons
const getDateObject = (day: number) =>
  new Date(props.currentYear, props.currentMonth, day);
const getPrevMonthDateObject = (day: number) =>
  new Date(props.currentYear, props.currentMonth - 1, day);

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDate(date: Date) {
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function selectedStartDate() {
  return props.selectedDates[0] ? new Date(props.selectedDates[0]) : null;
}

function selectedEndDate() {
  return props.selectedDates[1] ? new Date(props.selectedDates[1]) : null;
}

const isToday = (day: number) => {
  const today = new Date();
  return (
    today.getDate() === day &&
    today.getMonth() === props.currentMonth &&
    today.getFullYear() === props.currentYear
  );
};

function isDaySelectedDate(date: Date) {
  if (props.selectedDates.length === 0) return false;
  const f = formatDate(date);
  if (props.mode === "single") return props.selectedDates[0] === f;
  return props.selectedDates[0] === f || props.selectedDates[1] === f;
}

function isDayInRangeDate(date: Date) {
  if (props.mode !== "range" || props.selectedDates.length < 2) return false;
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const s = new Date(props.selectedDates[0]);
  s.setHours(0, 0, 0, 0);
  const e = new Date(props.selectedDates[1]);
  e.setHours(0, 0, 0, 0);
  return d > s && d < e;
}

function isRangeStartDate(date: Date) {
  if (props.mode !== "range" || props.selectedDates.length < 1) return false;
  return props.selectedDates[0] === formatDate(date);
}

function isRangeEndDate(date: Date) {
  if (props.mode !== "range" || props.selectedDates.length < 2) return false;
  return props.selectedDates[1] === formatDate(date);
}

const selectPrevMonthDay = (day: number) => {
  emit("select", { date: getPrevMonthDateObject(day) });
};

// Event handlers
const selectDay = (day: number) => {
  emit("select", { date: getDateObject(day) });
};
// Styles
const calendarStyles = tv({
  base: [
    "z-50 mt-1 min-w-[280px] rounded-lg border p-3 shadow-lg",
    "border-neutral-300 bg-white",
    "dark:border-neutral-700 dark:bg-neutral-800",
  ],
  variants: {
    placement: {
      top: "mb-1.5",
      bottom: "mt-1.5",
    },
    dense: {
      true: "p-2",
      false: "p-3",
    },
  },
  defaultVariants: {
    placement: "bottom",
    dense: false,
  },
});

const weekdayStyles = tv({
  base: [
    "text-center text-xs font-medium",
    "text-neutral-500",
    "dark:text-neutral-400",
  ],
  variants: {
    dense: {
      true: "py-0.5 text-[0.6rem]",
      false: "py-1 text-xs",
    },
  },
});

const dayStyles = tv({
  base: [
    "rounded-lg text-center transition-colors",
    "focus:ring-2 focus:ring-primary-500 focus:outline-none",
  ],
  variants: {
    dense: {
      true: "h-6 w-6 p-0 text-xs leading-6",
      false: "h-8 w-8 p-0 text-sm leading-8",
    },
    isSelected: {
      true: "bg-primary-500 text-white",
      false: "",
    },
    isInRange: {
      true: "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100",
      false: "",
    },
    isRangeStart: {
      true: "",
      false: "",
    },
    isRangeEnd: {
      true: "",
      false: "",
    },
    isToday: {
      true: "border border-neutral-400 dark:border-neutral-500",
      false: "",
    },
  },
  compoundVariants: [
    {
      isSelected: false,
      isInRange: false,
      class: [
        "text-neutral-900 hover:bg-neutral-200",
        "dark:text-neutral-100 dark:hover:bg-neutral-700",
      ],
    },
    {
      isSelected: false,
      isInRange: false,
      isToday: false,
      class: "bg-transparent",
    },
  ],
  defaultVariants: {
    dense: false,
    isSelected: false,
    isInRange: false,
    isRangeStart: false,
    isRangeEnd: false,
    isToday: false,
  },
});

const positionStyle = computed(
  () =>
    ({
      position: "fixed",
      "position-anchor": props.anchorName,
      "position-area": `${props.placement ?? "bottom"} span-right`,
    }) as Record<string, string>
);
</script>
