import { fn } from "storybook/test";
import { ref } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Slider from "./Slider.vue";

const meta = {
  component: Slider,
  tags: ["autodocs"],
  argTypes: {
    dense: { control: "boolean" },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
    range: {
      control: "boolean",
      description:
        "Enable dual-handle range mode. v-model becomes [number, number].",
      table: { category: "props", type: { summary: "boolean" } },
    },
    default: {
      control: "text",
      description: "Default slot content",
      table: {
        category: "slots",
        type: { summary: "html" },
      },
    },
    min: {
      control: "number",
      description: "Minimum value",
      table: { category: "props", type: { summary: "number" } },
    },
    max: {
      control: "number",
      description: "Maximum value",
      table: { category: "props", type: { summary: "number" } },
    },
    step: {
      control: "number",
      description: "Step increment",
      table: { category: "props", type: { summary: "number" } },
    },
    options: {
      control: "array",
      description: "Datalist options for snap markers",
      table: {
        category: "props",
        type: { summary: "Array<{ label?: string; value: string | number }>" },
      },
    },
  },
  args: {
    default: "Label",
    onClick: fn(),
    onFocus: fn(),
    onBlur: fn(),
    onChange: fn(),
    "onUpdate:modelValue": fn(),
    dense: false,
    range: false,
    min: undefined,
    max: undefined,
  },
  render: (args: any) => ({
    setup() {
      const value = ref<number | [number, number]>();

      return () => (
        <Slider
          {...args}
          v-model={value.value}
        >
          {{
            default: () => args.default,
          }}
        </Slider>
      );
    },
  }),
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dense: Story = {
  args: {
    dense: true,
  },
};

export const WithLimits: Story = {
  args: {
    min: 0,
    max: 100,
  },
};

export const WithOptions: Story = {
  args: {
    min: 0,
    max: 100,
    options: [
      { value: 0, label: "0" },
      { value: 25, label: "25" },
      { value: 50, label: "50" },
      { value: 75, label: "75" },
      { value: 100, label: "100" },
    ],
  },
};

export const Range: Story = {
  args: {
    range: true,
    min: 0,
    max: 100,
  },
  render: (args: any) => ({
    setup() {
      const value = ref<[number, number]>([20, 80]);

      return () => (
        <Slider
          {...args}
          v-model={value.value}
        >
          {{
            default: () => args.default,
          }}
        </Slider>
      );
    },
  }),
};

export const RangeDense: Story = {
  args: {
    range: true,
    dense: true,
    min: 0,
    max: 100,
  },
  render: (args: any) => ({
    setup() {
      const value = ref<[number, number]>([20, 80]);

      return () => (
        <Slider
          {...args}
          v-model={value.value}
        >
          {{
            default: () => args.default,
          }}
        </Slider>
      );
    },
  }),
};

export const RangeDisabled: Story = {
  args: {
    range: true,
    disabled: true,
    min: 0,
    max: 100,
  },
  render: (args: any) => ({
    setup() {
      const value = ref<[number, number]>([30, 70]);

      return () => (
        <Slider
          {...args}
          v-model={value.value}
        >
          {{
            default: () => args.default,
          }}
        </Slider>
      );
    },
  }),
};

export const RangeWithOptions: Story = {
  args: {
    range: true,
    min: 0,
    max: 100,
    options: [
      { value: 0, label: "0" },
      { value: 25, label: "25" },
      { value: 50, label: "50" },
      { value: 75, label: "75" },
      { value: 100, label: "100" },
    ],
  },
  render: (args: any) => ({
    setup() {
      const value = ref<[number, number]>([25, 75]);

      return () => (
        <Slider
          {...args}
          v-model={value.value}
        >
          {{
            default: () => args.default,
          }}
        </Slider>
      );
    },
  }),
};
