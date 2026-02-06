import { fn } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Button from "./Button.vue";

const meta = {
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    dense: { control: "boolean" },
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
    primary: false,
    ghost: false,
    default: "Button",
    onClick: fn(),
    onFocus: fn(),
    onBlur: fn(),
  },
  render: (args: any) => ({
    setup() {
      return () => (
        <Button {...args}>
          {{
            default: () => { return args.default; },
          }}
        </Button>
      );
    },
  }),
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    primary: true,
  },
};

export const Secondary: Story = {
  args: {
    primary: false,
  },
};

export const Ghost: Story = {
  args: {
    ghost: true,
  },
};

export const Dense: Story = {
  args: {
    dense: true,
  },
};

