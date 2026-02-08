import { fn } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import DataTable from "./DataTable.vue";
import Button from "@/components/core/Button/Button.vue";
import Tooltip from "@/components/feedback/Tooltip/Tooltip.vue";
import { PiEye, PiPencilSimple, PiTrash } from "vue-icons-plus/pi";

const items = [
  { name: "Alice Johnson", role: "Engineer", salary: 95000, hours: 160 },
  { name: "Bob Smith", role: "Designer", salary: 82000, hours: 152 },
  { name: "Carol White", role: "Manager", salary: 110000, hours: 168 },
];

const onView = fn();
const onEdit = fn();
const onDelete = fn();

const meta = {
  component: DataTable,
  tags: ["autodocs"],
  argTypes: {
    headers: { control: "object" },
    items: { control: "object" },
    dense: { control: "boolean" },
    loading: { control: "boolean" },
    loadingRows: { control: "number" },
    actions: { table: { category: "slots" } },
  },
  args: {
    headers: [
      { title: "Name", key: "name", sortable: true },
      { title: "Role", key: "role", sortable: true },
      {
        title: "Hourly Rate",
        key: "rate",
        sortable: true,
        value: (item: Record<string, unknown>) =>
          `$${((item.salary as number) / (item.hours as number)).toFixed(2)}/hr`,
      },
    ],
    items,
    dense: false,
    loading: false,
  },
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dense: Story = {
  args: {
    dense: true,
  },
};

export const Sortable: Story = {
  args: {
    headers: [
      { title: "Name", key: "name", sortable: true },
      { title: "Role", key: "role", sortable: true },
      { title: "Salary", key: "salary", sortable: true },
      { title: "Hours", key: "hours", sortable: true },
    ],
  },
};

export const ComputedValues: Story = {
  args: {
    headers: [
      { title: "Name", key: "name" },
      {
        title: "Summary",
        key: "summary",
        value: (item: Record<string, unknown>) =>
          `${item.name} works as ${(item.role as string).toLowerCase()}`,
      },
    ],
  },
};

export const Aligned: Story = {
  args: {
    headers: [
      { title: "Name", key: "name", sortable: true },
      { title: "Role", key: "role", sortable: true },
      { title: "Salary", key: "salary", sortable: true, align: "end" as const },
      { title: "Hours", key: "hours", sortable: true, align: "end" as const },
    ],
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const Actions: Story = {
  args: {
    headers: [
      { title: "Name", key: "name" },
      { title: "Role", key: "role" },
    ],
  },
  render: (args) => ({
    components: { DataTable, Button, Tooltip, PiEye, PiPencilSimple, PiTrash },
    setup: () => ({ args, onView, onEdit, onDelete }),
    template: `
      <DataTable v-bind="args">
        <template #actions="{ item }">
          <div class="inline-flex items-center gap-1">
            <Tooltip content="View" placement="top">
              <Button ghost dense @click="onView(item)"><PiEye class="h-4 w-4" /></Button>
            </Tooltip>
            <Tooltip content="Edit" placement="top">
              <Button ghost dense @click="onEdit(item)"><PiPencilSimple class="h-4 w-4" /></Button>
            </Tooltip>
            <Tooltip content="Delete" placement="top">
              <Button dense destructive @click="onDelete(item)"><PiTrash class="h-4 w-4" /></Button>
            </Tooltip>
          </div>
        </template>
      </DataTable>
    `,
  }),
};
