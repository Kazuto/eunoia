import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Divider from "./Divider.vue";

const meta = {
  component: Divider,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
    label: { control: "text" },
  },
  args: {
    orientation: "horizontal",
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
  },
  decorators: [
    () => ({
      setup() {
        return () => (
          <div
            style={{
              display: "flex",
              height: "100px",
              alignItems: "stretch",
              gap: "12px",
            }}
          >
            <span>Left</span>
            <story />
            <span>Right</span>
          </div>
        );
      },
    }),
  ],
};

export const WithLabel: Story = {
  args: {
    label: "OR",
  },
};

export const VerticalWithLabel: Story = {
  args: {
    orientation: "vertical",
    label: "OR",
  },
  decorators: [
    () => ({
      setup() {
        return () => (
          <div
            style={{
              display: "flex",
              height: "100px",
              alignItems: "stretch",
              gap: "12px",
            }}
          >
            <span>Left</span>
            <story />
            <span>Right</span>
          </div>
        );
      },
    }),
  ],
};
