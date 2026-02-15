import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Colors from "./Colors.vue";

const meta = {
  component: Colors,
  tags: ["autodocs"],
} satisfies Meta<typeof Colors>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
