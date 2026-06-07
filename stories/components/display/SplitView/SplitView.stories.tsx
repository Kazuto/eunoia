import type { Meta, StoryObj } from "@storybook/vue3-vite";
import SplitView from "./SplitView.vue";
import { type SplitViewItem } from "./SplitView.vue";
import { ref } from "vue";

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
    items: { control: "object" },
    selected: { control: "object" },
  },
  args: {
    items,
    selected: items[0],
  },
} satisfies Meta<typeof SplitView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { SplitView },
    setup() {
      const selected = ref(args.selected);

      return { selected, items, information };
    },
    template: `
      <SplitView :items="items" :selected="selected" @select="selected = $event">
        <template #default="{ selected }">
          {{ information.find(i => i.key === selected?.key)?.label }} is
          {{ information.find(i => i.key === selected?.key)?.age }} years old
          and lives in {{ information.find(i => i.key === selected?.key)?.location }}.
        </template>
      </SplitView>
    `,
  }),
};
