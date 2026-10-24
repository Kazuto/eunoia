import { fn } from "storybook/test";
import { ref } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Rating from "./Rating.vue";

const meta = {
  component: Rating,
  tags: ["autodocs"],
  argTypes: {
    max: { control: { type: "number", min: 1, max: 10 } },
    allowHalf: { control: "boolean" },
    readonly: { control: "boolean" },
    disabled: { control: "boolean" },
    dense: { control: "boolean" },
    name: { control: "text" },
    default: {
      control: "text",
      description: "Label",
      table: {
        category: "slots",
        type: { summary: "html" },
      },
    },
  },
  args: {
    default: "How was your stay?",
    max: 5,
    allowHalf: false,
    readonly: false,
    disabled: false,
    dense: false,
    "onUpdate:modelValue": fn(),
    onChange: fn(),
  },
  render: (args: any) => ({
    setup() {
      const value = ref(args.modelValue ?? 3);

      return () => (
        <Rating
          {...args}
          v-model={value.value}
        >
          {{ default: () => args.default }}
        </Rating>
      );
    },
  }),
} satisfies Meta<typeof Rating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const HalfStars: Story = {
  args: {
    allowHalf: true,
    modelValue: 3.5,
  },
};

export const TenPoints: Story = {
  args: {
    max: 10,
    modelValue: 7,
  },
};

export const Readonly: Story = {
  args: {
    default: "Average rating",
    readonly: true,
    modelValue: 4.5,
  },
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
