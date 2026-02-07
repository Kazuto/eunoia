import { fn } from "storybook/test";
import { ref } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Toast from "./Toast.vue";

const meta = {
  component: Toast,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "success", "warning", "danger"],
    },
    position: {
      control: "select",
      options: [
        "top-left",
        "top-center",
        "top-right",
        "bottom-left",
        "bottom-center",
        "bottom-right",
      ],
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
    default: "This is a toast notification.",
    variant: "info",
    position: "bottom-right",
    dense: false,
    dismissible: true,
    persistent: true,
    duration: 5000,
    onDismiss: fn(),
  },
  render: (args: any) => ({
    setup() {
      const show = ref(false);
      const key = ref(0);

      function trigger() {
        key.value++;
        show.value = true;
      }

      function onDismiss() {
        show.value = false;
        args.onDismiss?.();
      }

      return () => (
        <div>
          <button
            onClick={trigger}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            Show Toast
          </button>
          {show.value && (
            <Toast {...args} key={key.value} onDismiss={onDismiss}>
              {{
                default: () => {
                  return args.default;
                },
              }}
            </Toast>
          )}
        </div>
      );
    },
  }),
} satisfies Meta<typeof Toast>;

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
    default: "Changes saved successfully.",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    default: "Your session is about to expire.",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    default: "Failed to save changes.",
  },
};

export const TopLeft: Story = {
  args: {
    position: "top-left",
  },
};

export const TopCenter: Story = {
  args: {
    position: "top-center",
  },
};

export const TopRight: Story = {
  args: {
    position: "top-right",
  },
};

export const BottomLeft: Story = {
  args: {
    position: "bottom-left",
  },
};

export const BottomCenter: Story = {
  args: {
    position: "bottom-center",
  },
};

export const BottomRight: Story = {
  args: {
    position: "bottom-right",
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
    default: "This toast will disappear in 3 seconds.",
  },
};

export const Dense: Story = {
  args: {
    dense: true,
  },
};
