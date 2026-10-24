import { fn } from "storybook/test";
import { ref } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import ColorPicker from "./ColorPicker.vue";

const BRAND_SWATCHES = [
  "#a88bc7",
  "#4c87e5",
  "#47a641",
  "#f5b40b",
  "#f83b66",
  "#6e6e6e",
];

const meta = {
  component: ColorPicker,
  tags: ["autodocs"],
  argTypes: {
    alpha: { control: "boolean" },
    swatches: { control: "object" },
    dense: { control: "boolean" },
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
    helper: { control: "text" },
    errors: { control: "object" },
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
    default: "Accent color",
    alpha: false,
    dense: false,
    invalid: false,
    disabled: false,
    "onUpdate:modelValue": fn(),
  },
  render: (args: any) => ({
    setup() {
      const value = ref(args.modelValue ?? "#a88bc7");

      return () => (
        <div class="max-w-xs">
          <ColorPicker
            {...args}
            v-model={value.value}
          >
            {{ default: () => args.default }}
          </ColorPicker>
        </div>
      );
    },
  }),
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAlpha: Story = {
  args: {
    alpha: true,
    modelValue: "#4c87e5cc",
  },
};

export const WithSwatches: Story = {
  args: {
    swatches: BRAND_SWATCHES,
  },
};

export const Dense: Story = {
  args: {
    dense: true,
    swatches: BRAND_SWATCHES,
  },
};

export const WithHelper: Story = {
  args: {
    helper: "Used for buttons, links and focus rings.",
  },
};

export const Invalid: Story = {
  args: {
    invalid: true,
    errors: ["Pick a color with enough contrast against white."],
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
