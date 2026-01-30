import { fn } from "storybook/test";
import { ref } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Input from "./Input.vue";

const meta = {
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    type: { control: "select", options: ["text", "password", "number"] },
    size: { control: "select", options: ["small", "medium", "large"] },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
    default: {
      control: "text",
      description: "Default slot content",
      table: {
        category: "slots",
        type: { summary: "html" },
      },
    },
  },
  args: {
    default: "Label",
    onClick: fn(),
    onFocus: fn(),
    onBlur: fn(),
    onChange: fn(),
    'onUpdate:modelValue': fn(),
    size: "medium",
  },
  render: (args: any) => ({
    setup() {
      const value = ref<string | number>();

      return () => (
        <Input {...args} v-model={value.value}>
          {{
            default: () => { return args.default; },
          }}
        </Input>
      );
    },
  }),
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
  args: {
    size: "small",
  },
};

export const Large: Story = {
  args: {
    size: "large",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Invalid: Story = {
  args: {
    invalid: true,
  },
};

export const Text: Story = {
  args: {
    type: "text",
  },
};

export const Password: Story = {
  args: {
    type: "password",
  },
};

export const Number: Story = {
  args: {
    type: "number",
  },
};
