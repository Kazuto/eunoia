import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Badge from "./Badge.vue";

const meta = {
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "success", "warning", "danger"],
    },
    dense: { control: "boolean" },
    pill: { control: "boolean" },
    count: { control: "number" },
    maxCount: { control: "number" },
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
    default: "Badge",
    variant: "primary",
    dense: false,
    pill: false,
  },
  render: (args: any) => ({
    setup() {
      return () => (
        <Badge {...args}>
          {{
            default: () => {
              return args.default;
            },
          }}
        </Badge>
      );
    },
  }),
} satisfies Meta<typeof Badge>;

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

export const Pill: Story = {
  args: {
    pill: true,
  },
};

export const WithCount: Story = {
  args: {
    default: "Notifications",
    count: 5,
  },
};

export const WithCountOverflow: Story = {
  args: {
    default: "Messages",
    count: 150,
    maxCount: 99,
  },
};

export const WithCountDense: Story = {
  args: {
    default: "Alerts",
    count: 3,
    dense: true,
  },
};
