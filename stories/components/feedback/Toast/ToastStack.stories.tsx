import { ref } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import ToastStack from "./ToastStack.vue";

const variants = ["info", "success", "warning", "danger"] as const;
const messages = [
  "This is an info notification.",
  "Changes saved successfully.",
  "Your session is about to expire.",
  "Failed to save changes.",
];

const meta = {
  component: ToastStack,
  tags: ["autodocs"],
  argTypes: {
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
    limit: { control: "number" },
    dense: { control: "boolean" },
  },
  args: {
    position: "bottom-right",
    limit: 3,
    dense: false,
  },
  render: (args: any) => ({
    setup() {
      const stack = ref<InstanceType<typeof ToastStack> | null>(null);
      let count = 0;

      function addToast() {
        const index = count % variants.length;
        stack.value?.add({
          message: messages[index],
          variant: variants[index],
          dismissible: true,
          persistent: true,
        });
        count++;
      }

      return () => (
        <div>
          <button
            onClick={addToast}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            Add Toast
          </button>
          <ToastStack
            ref={stack}
            {...args}
          />
        </div>
      );
    },
  }),
} satisfies Meta<typeof ToastStack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TopRight: Story = {
  args: {
    position: "top-right",
  },
};

export const TopCenter: Story = {
  args: {
    position: "top-center",
  },
};

export const Dense: Story = {
  args: {
    dense: true,
  },
};

export const AutoHide: Story = {
  render: (args: any) => ({
    setup() {
      const stack = ref<InstanceType<typeof ToastStack> | null>(null);
      let count = 0;

      function addToast() {
        const index = count % variants.length;
        stack.value?.add({
          message: "This toast will disappear in 3 seconds.",
          variant: variants[index],
          dismissible: true,
          persistent: false,
          duration: 3000,
        });
        count++;
      }

      return () => (
        <div>
          <button
            onClick={addToast}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            Add Auto-Hide Toast
          </button>
          <ToastStack
            ref={stack}
            {...args}
          />
        </div>
      );
    },
  }),
};
