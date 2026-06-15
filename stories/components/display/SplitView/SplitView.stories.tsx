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
