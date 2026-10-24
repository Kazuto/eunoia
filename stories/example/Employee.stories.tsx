import { fn } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import EmployeePage from "./Employee.vue";

const meta = {
  component: EmployeePage,
  title: "example/Employee",
  parameters: {
    layout: "fullscreen",
    unwrapped: true,
  },
  args: {
    onNavigate: fn(),
    onMessage: fn(),
    onEdit: fn(),
  },
} satisfies Meta<typeof EmployeePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Employee: Story = {};
