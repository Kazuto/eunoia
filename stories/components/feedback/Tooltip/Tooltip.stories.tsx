import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Tooltip from "./Tooltip.vue";

const meta = {
  component: Tooltip,
  tags: ["autodocs"],
  argTypes: {
    placement: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
    },
    dense: { control: "boolean" },
    content: { control: "text" },
  },
  args: {
    content: "Tooltip text",
    placement: "top",
    dense: false,
  },
  render: (args: any) => ({
    setup() {
      return () => (
        <div style={{ padding: "100px", display: "flex", justifyContent: "center" }}>
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
    content: "This is a longer tooltip message that provides more detailed information.",
  },
};
