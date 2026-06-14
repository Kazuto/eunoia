import { fn } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { Pagination } from "@/components";
import { ref } from "vue";

const meta = {
  component: Pagination,
  tags: ["autodocs"],
  argTypes: {
    dense: {
      control: "boolean",
      description: "Compact sizing",
    },
    total: {
      control: "number",
      description: "Total number of pages",
    },
    current: {
      control: "number",
      description: "Current page",
    },
    perPageOptions: {
      control: "object",
      description: "Per-page options",
    },
  },
  args: {
    total: 100,
    current: 1,
    perPageOptions: [
      { label: "10", value: 10 },
      { label: "25", value: 25 },
      { label: "50", value: 50 },
      { label: "100", value: 100 },
    ],
    "onUpdate:current": fn(),
    "onUpdate:perPage": fn(),
  },
  render: (args) => ({
    components: { Pagination },
    setup() {
      const current = ref(1);

      return { args, current };
    },
    template: `
      <Pagination v-bind="args" v-model:current="current" />
    `,
  }),
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dense: Story = {
  args: {
    dense: true,
  },
};
