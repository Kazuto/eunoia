import { fn } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Chip from "./Chip.vue";

const meta = {
  component: Chip,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "success", "warning", "danger"],
    },
    dense: { control: "boolean" },
    removable: { control: "boolean" },
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
    default: "Chip",
    variant: "primary",
    dense: false,
    removable: false,
    onClick: fn(),
    onFocus: fn(),
    onBlur: fn(),
    onRemove: fn(),
  },
  render: (args: any) => ({
    setup() {
      return () => (
        <Chip {...args}>
          {{
            default: () => {
              return args.default;
            },
          }}
        </Chip>
      );
    },
  }),
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
  },
};

export const Dense: Story = {
  args: {
    dense: true,
  },
};

export const Removable: Story = {
  args: {
    removable: true,
  },
};

export const RemovableDense: Story = {
  args: {
    removable: true,
    dense: true,
  },
};
