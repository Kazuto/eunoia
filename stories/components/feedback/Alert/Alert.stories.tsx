import { fn } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Alert from "./Alert.vue";

const meta = {
  component: Alert,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "success", "warning", "danger"],
    },
    dense: { control: "boolean" },
    dismissible: { control: "boolean" },
    persistent: { control: "boolean" },
    duration: { control: "number" },
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
    default: "This is an alert message.",
    variant: "info",
    dense: false,
    dismissible: false,
    persistent: true,
    duration: 5000,
    onDismiss: fn(),
  },
  render: (args: any) => ({
    setup() {
      return () => (
        <Alert {...args}>
          {{
            default: () => {
              return args.default;
            },
          }}
        </Alert>
      );
    },
  }),
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    variant: "info",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    default: "Operation completed successfully.",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    default: "Please review your input before continuing.",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    default: "An error occurred. Please try again.",
  },
};

export const Dismissible: Story = {
  args: {
    dismissible: true,
  },
};

export const AutoHide: Story = {
  args: {
    persistent: false,
    duration: 3000,
    default: "This alert will disappear in 3 seconds.",
  },
};

export const Dense: Story = {
  args: {
    dense: true,
  },
};

export const DismissibleDense: Story = {
  args: {
    dismissible: true,
    dense: true,
  },
};
