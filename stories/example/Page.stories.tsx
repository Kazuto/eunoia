import { fn } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Page from "./Page.vue";

const meta = {
  component: Page,
  title: "Example/Page",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    unwrapped: true,
  },
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dashboard: Story = {
  args: {
    onView: fn(),
    onEdit: fn(),
    onDelete: fn(),
  },
};
