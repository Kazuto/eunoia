<template>
  <div v-bind="$attrs">
    <TabList
      :aria-label="ariaLabel"
      :dense
      :class="listClass"
      @keydown="onKeydown"
    >
      <Tab
        v-for="item in items"
        :id="tabId(item.value)"
        :key="item.value"
        :controls="panelId(item.value)"
        :active="item.value === activeValue"
        :dense
        :disabled="item.disabled"
        @select="select(item.value)"
      >
        <slot
          name="tab"
          :item="item"
          :active="item.value === activeValue"
        >
          {{ item.label }}
        </slot>
      </Tab>
    </TabList>
    <TabPanel
      v-if="activeItem && $slots.default"
      :id="panelId(activeItem.value)"
      :labelledby="tabId(activeItem.value)"
      :class="panelClass"
    >
      <slot :item="activeItem" />
    </TabPanel>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick } from "vue";
import { useSanitizedId } from "@/composables";
import TabList from "./primitives/TabList.vue";
import Tab from "./primitives/Tab.vue";
import TabPanel from "./primitives/TabPanel.vue";

export type TabItem = {
  value: string;
  label: string;
  disabled?: boolean;
};

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    items: TabItem[];
    ariaLabel?: string;
    dense?: boolean;
    /** Classes for the tab row, e.g. padding or a border. */
    listClass?: string;
    /** Classes for the panel, e.g. `flex-1 overflow-y-auto`. */
    panelClass?: string;
  }>(),
  { ariaLabel: undefined, listClass: undefined, panelClass: undefined }
);

defineSlots<{
  default?: (props: { item: TabItem }) => unknown;
  tab?: (props: { item: TabItem; active: boolean }) => unknown;
}>();

const model = defineModel<string>();
const baseId = useSanitizedId("tabs");

const enabledItems = computed(() =>
  props.items.filter((item) => !item.disabled)
);
// Fall back to the first enabled tab so the list always has one focusable tab.
const activeValue = computed(() =>
  enabledItems.value.some((item) => item.value === model.value)
    ? model.value
    : enabledItems.value[0]?.value
);
const activeItem = computed(() =>
  props.items.find((item) => item.value === activeValue.value)
);

function sanitize(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "-");
}

function tabId(value: string) {
  return `${baseId}-tab-${sanitize(value)}`;
}

function panelId(value: string) {
  return `${baseId}-panel-${sanitize(value)}`;
}

function select(value: string) {
  model.value = value;
}

async function focusTab(value: string) {
  select(value);
  await nextTick();
  document.getElementById(tabId(value))?.focus();
}

// Arrow keys move and activate in one step (automatic activation), skipping
// disabled tabs and wrapping at either end.
function onKeydown(event: KeyboardEvent) {
  const enabled = enabledItems.value;
  if (!enabled.length) return;
  const index = enabled.findIndex((item) => item.value === activeValue.value);
  const target = (() => {
    switch (event.key) {
      case "ArrowRight":
        return enabled[(index + 1) % enabled.length];
      case "ArrowLeft":
        return enabled[(index - 1 + enabled.length) % enabled.length];
      case "Home":
        return enabled[0];
      case "End":
        return enabled[enabled.length - 1];
      default:
        return undefined;
    }
  })();
  if (!target) return;
  event.preventDefault();
  focusTab(target.value);
}
</script>
