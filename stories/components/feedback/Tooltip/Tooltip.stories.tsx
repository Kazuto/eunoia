import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Tooltip from "./Tooltip.vue";

const meta = {
  component: Tooltip,
  tags: ["autodocs"],
  argTypes: {
    placement: {
      control: "select",
      options: ["top", "bottom", "left", "right", "top-start", "bottom-start"],
    },
    dense: { control: "boolean" },
    content: { control: "text" },
    teleportTo: {
      control: "text",
      description: "Teleport outside clipping containers, e.g. body",
    },
    delay: {
      control: "number",
      description: "Milliseconds the pointer must rest before showing",
    },
  },
  args: {
    content: "Tooltip text",
    placement: "top",
    dense: false,
  },
  render: (args: any) => ({
    setup() {
      return () => (
        <div
          style={{
            padding: "100px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Tooltip {...args}>
            {{
              default: () => (
                <button
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    cursor: "pointer",
                  }}
                >
                  Hover me
                </button>
              ),
            }}
          </Tooltip>
        </div>
      );
    },
  }),
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Top: Story = {
  args: {
    placement: "top",
  },
};

export const Bottom: Story = {
  args: {
    placement: "bottom",
  },
};

export const Left: Story = {
  args: {
    placement: "left",
  },
};

export const Right: Story = {
  args: {
    placement: "right",
  },
};

export const Dense: Story = {
  args: {
    dense: true,
  },
};

export const LongContent: Story = {
  args: {
    content:
      "This is a longer tooltip message that provides more detailed information.",
  },
};

export const Delayed: Story = {
  args: {
    delay: 500,
    content: "Shows after the pointer rests for half a second",
  },
};

export const TopStart: Story = {
  args: {
    placement: "top-start",
    content: "Lines up with the start of a short anchor",
  },
};
