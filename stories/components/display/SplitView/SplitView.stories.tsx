import { fn } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import SplitView from "./SplitView.vue";
import { type SplitViewItem } from "./SplitView.vue";
import { computed, ref } from "vue";

const items: SplitViewItem[] = [
  { key: 0, label: "Alice Johnson" },
  { key: 1, label: "Bob Smith" },
  { key: 2, label: "Carol White" },
];

const information = [
  { key: 0, label: "Alice Johnson", age: 30, location: "New York" },
  { key: 1, label: "Bob Smith", age: 25, location: "Los Angeles" },
  { key: 2, label: "Carol White", age: 40, location: "San Francisco" },
];

const meta = {
  component: SplitView,
  tags: ["autodocs"],
  argTypes: {
    search: { control: "text" },
    items: { control: "object" },
    selected: { control: "object" },
  },
  args: {
    items,
    search: "",
    selected: items[0],
    onSelect: fn(),
  },
  render: (args) => ({
    components: { SplitView },
    setup() {
      const selected = ref(args.selected);

      return { args, selected, information, items };
    },
    template: `
      <SplitView v-bind="args" :items="items" :selected="selected" @select="selected = $event">
        <template #default="{ item }">
          {{ information.find(i => i.key === item?.key)?.label }} is
          {{ information.find(i => i.key === item?.key)?.age }} years old
          and lives in {{ information.find(i => i.key === item?.key)?.location }}.
        </template>
      </SplitView>
    `,
  }),
} satisfies Meta<typeof SplitView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Searchable: Story = {
  render: (args) => ({
    components: { SplitView },
    setup() {
      const selected = ref(args.selected);
      const search = ref("");

      const filteredItems = computed(() => {
        if (!search.value) return items;

        return items.filter((item: SplitViewItem) =>
          item.label.toLowerCase().includes(search.value.toLowerCase())
        );
      });

      return { args, selected, information, filteredItems, search };
    },
    template: `
      <SplitView v-bind="args" :items="filteredItems" :selected="selected" @select="selected = $event" searchable v-model:search="search">
        <template #default="{ item }">
          {{ information.find(i => i.key === item?.key)?.label }} is
          {{ information.find(i => i.key === item?.key)?.age }} years old
          and lives in {{ information.find(i => i.key === item?.key)?.location }}.
        </template>
      </SplitView>
    `,
  }),
};

export const ScrollableContent: Story = {
  render: (args) => ({
    components: { SplitView },
    setup() {
      const rows = Array.from({ length: 40 }, (_, key) => ({
        key,
        label: `Item ${key + 1}`,
      }));
      const selected = ref(rows[0]);
      const search = ref("");
      const filteredItems = computed(() =>
        rows.filter((item) =>
          item.label.toLowerCase().includes(search.value.toLowerCase())
        )
      );

      return { args, selected, search, filteredItems };
    },
    template: `
      <div class="h-[480px]">
        <SplitView v-bind="args" :items="filteredItems" :selected="selected" @select="selected = $event" searchable v-model:search="search">
          <template #header="{ item }">
            <h2 class="font-semibold">{{ item?.label }}</h2>
            <p class="text-sm text-neutral-500">The header stays visible while the content scrolls.</p>
          </template>
          <template #default="{ item }">
            <div class="space-y-6">
              <label v-for="field in 20" :key="field" class="block">
                <span class="mb-2 block text-sm">{{ item?.label }} — Field {{ field }}</span>
                <textarea class="w-full rounded-sm border border-neutral-200 p-3 dark:border-neutral-700" rows="2" placeholder="Enter content" />
              </label>
            </div>
          </template>
          <template #footer="{ item }">
            <p class="text-sm text-neutral-500">Editing {{ item?.label }} — the footer stays visible.</p>
          </template>
        </SplitView>
      </div>
    `,
  }),
};

export const VirtualInfinite: Story = {
  render: (args) => ({
    components: { SplitView },
    setup() {
      const TOTAL = 10000;
      const PAGE = 100;
      const items = ref<SplitViewItem[]>([]);
      const loading = ref(false);
      const selected = ref<SplitViewItem>();
      const search = ref("");

      async function loadMore() {
        if (loading.value || items.value.length >= TOTAL) return;
        loading.value = true;
        await new Promise((resolve) => setTimeout(resolve, 300));
        const start = items.value.length;
        items.value = [
          ...items.value,
          ...Array.from({ length: PAGE }, (_, offset) => ({
            key: start + offset,
            label: `Item ${start + offset + 1}`,
          })),
        ];
        selected.value ??= items.value[0];
        loading.value = false;
      }
      loadMore();

      const hasMore = computed(() => items.value.length < TOTAL);

      return {
        args,
        items,
        loading,
        hasMore,
        selected,
        search,
        loadMore,
        TOTAL,
      };
    },
    template: `
      <div class="h-[480px]">
        <SplitView
          v-bind="args"
          :items="items"
          :selected="selected"
          searchable
          sticky-search
          virtual
          :has-more="hasMore"
          :loading="loading"
          :total="TOTAL"
          v-model:search="search"
          @select="selected = $event"
          @end-reached="loadMore"
        >
          <template #listFooter>
            <p v-if="loading" class="px-4 py-2 text-xs text-neutral-500">Loading…</p>
          </template>
          <template #default="{ item }">
            {{ item?.label }} — {{ items.length }} of {{ TOTAL }} loaded, only the visible rows are in the DOM.
          </template>
        </SplitView>
      </div>
    `,
  }),
};

export const Selectable: Story = {
  render: (args) => ({
    components: { SplitView },
    setup() {
      const selected = ref(args.selected);
      const selection = ref<SplitViewItem["key"][]>([]);

      return { args, selected, selection, information, items };
    },
    template: `
      <SplitView
        v-bind="args"
        v-model:selection="selection"
        selectable
        :items="items"
        :selected="selected"
        @select="selected = $event"
      >
        <template #default="{ item }">
          {{ selection.length }} checked. Hold Shift to check a range.
        </template>
      </SplitView>
    `,
  }),
};
