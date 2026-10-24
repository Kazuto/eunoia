import { fn } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import DashboardPage from "./Dashboard.vue";

const meta = {
  component: DashboardPage,
  title: "example/Dashboard",
  parameters: {
    layout: "fullscreen",
    unwrapped: true,
  },
  args: {
    onNavigate: fn(),
    onView: fn(),
    onEdit: fn(),
    onDelete: fn(),
  },
} satisfies Meta<typeof DashboardPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dashboard: Story = {};
