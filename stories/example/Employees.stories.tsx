import { fn } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import EmployeesPage from "./Employees.vue";

const meta = {
  component: EmployeesPage,
  title: "example/Employees",
  parameters: {
    layout: "fullscreen",
    unwrapped: true,
  },
  args: {
    onNavigate: fn(),
    onAdd: fn(),
    onImport: fn(),
    onExport: fn(),
    onShowArchived: fn(),
    onView: fn(),
    onEdit: fn(),
  },
} satisfies Meta<typeof EmployeesPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Employees: Story = {};
