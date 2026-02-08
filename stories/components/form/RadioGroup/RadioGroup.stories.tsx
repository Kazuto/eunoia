import { fn } from "storybook/test";
import { ref } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import RadioGroup from "./RadioGroup.vue";

const meta = {
  component: RadioGroup,
  tags: ["autodocs"],
  argTypes: {
    options: { control: "object" },
    dense: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    options: [
      { label: "Daily", value: "daily" },
      { label: "Weekly", value: "weekly" },
      { label: "Monthly", value: "monthly" },
      { label: "Yearly", value: "yearly" },
    ],
    dense: false,
    disabled: false,
    "onUpdate:modelValue": fn(),
  },
  render: (args: any) => ({
    setup() {
      const selected = ref<string>("monthly");

      return () => (
        <RadioGroup {...args} v-model={selected.value} />
      );
    },
  }),
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ThreeOptions: Story = {
  args: {
    options: [
      { label: "Day", value: "day" },
      { label: "Week", value: "week" },
      { label: "Month", value: "month" },
    ],
  },
  render: (args: any) => ({
    setup() {
      const selected = ref<string>("week");

      return () => (
        <RadioGroup {...args} v-model={selected.value} />
      );
    },
  }),
};

export const Dense: Story = {
  args: {
    dense: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
