import { fn } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import DataTable from "./DataTable.vue";
import { Badge, Button, Icon, Tooltip } from "@/components";

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
    columns: { control: "object" },
    items: { control: "object" },
    dense: { control: "boolean" },
    loading: { control: "boolean" },
    loadingRows: { control: "number" },
    actions: { table: { category: "slots" } },
    rowClass: { control: "function" },
    stack: { control: "select", options: ["auto", "always", "never"] },
  },
  args: {
    columns: [
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
    stack: "auto",
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

export const RowClass: Story = {
  args: {
    columns: [
      { title: "Name", key: "name" },
      { title: "Role", key: "role" },
    ],
    rowClass: (item: Record<string, unknown>) =>
      item.name === "Bob Smith" ? "text-neutral-400 dark:text-neutral-600" : "",
  },
};

export const Sortable: Story = {
  args: {
    columns: [
      { title: "Name", key: "name", sortable: true },
      { title: "Role", key: "role", sortable: true },
      { title: "Salary", key: "salary", sortable: true },
      { title: "Hours", key: "hours", sortable: true },
    ],
  },
};

export const ComputedValues: Story = {
  args: {
    columns: [
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
    columns: [
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
    columns: [
      { title: "Name", key: "name" },
      { title: "Role", key: "role" },
    ],
  },
  render: (args) => ({
    components: { DataTable, Button, Icon, Tooltip },
    setup: () => ({ args, onView, onEdit, onDelete }),
    template: `
      <DataTable v-bind="args">
        <template #actions="{ item }">
          <div class="inline-flex items-center gap-1">
            <Tooltip content="View" placement="top">
              <Button ghost dense @click="onView(item)"><Icon name="eye" size="sm" /></Button>
            </Tooltip>
            <Tooltip content="Edit" placement="top">
              <Button ghost dense @click="onEdit(item)"><Icon name="pencil-simple" size="sm" /></Button>
            </Tooltip>
            <Tooltip content="Delete" placement="top">
              <Button dense destructive @click="onDelete(item)"><Icon name="trash" size="sm" /></Button>
            </Tooltip>
          </div>
        </template>
      </DataTable>
    `,
  }),
};

export const Empty: Story = {
  args: {
    items: [],
    columns: [
      { title: "Name", key: "name" },
      { title: "Role", key: "role" },
      { title: "Salary", key: "salary" },
    ],
  },
};

export const EmptyWithCustomContent: Story = {
  args: {
    items: [],
    columns: [
      { title: "Name", key: "name" },
      { title: "Role", key: "role" },
      { title: "Salary", key: "salary" },
    ],
  },
  render: (args) => ({
    components: { DataTable, Button, Icon },
    setup: () => ({ args }),
    template: `
      <DataTable v-bind="args">
        <template #empty>
          <div class="flex flex-col items-center py-12">
            <Icon name="user-list" class="h-12 w-12 text-neutral-400 dark:text-neutral-500" />
            <h3 class="mt-4 text-sm font-medium text-neutral-900 dark:text-neutral-100">
              No employees found
            </h3>
            <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Get started by adding your first employee.
            </p>
            <Button primary class="mt-6">
              <Icon name="plus" size="sm" />
              Add Employee
            </Button>
          </div>
        </template>
      </DataTable>
    `,
  }),
};

const projects = [
  {
    name: "Website relaunch",
    status: "Active",
    owner: "Alice Johnson",
    updated: "Yesterday",
  },
  {
    name: "Mobile app",
    status: "Draft",
    owner: "Bob Smith",
    updated: "Last week",
  },
  {
    name: "Annual report",
    status: "Archived",
    owner: "Carol White",
    updated: "Last month",
  },
];

const projectColumns = [
  { title: "Name", key: "name", sortable: true },
  { title: "Status", key: "status", sortable: true },
  { title: "Owner", key: "owner", sortable: true },
  { title: "Updated", key: "updated" },
];

const statusVariants: Record<string, "success" | "secondary" | "warning"> = {
  Active: "success",
  Draft: "warning",
  Archived: "secondary",
};

const projectTemplate = `
  <DataTable v-bind="args">
    <template #status="{ item }">
      <Badge :variant="statusVariants[item.status]" dense pill>{{ item.status }}</Badge>
    </template>
    <template #actions="{ item }">
      <div class="inline-flex items-center gap-1">
        <Tooltip content="Edit" placement="top">
          <Button ghost dense aria-label="Edit" @click="onEdit(item)"><Icon name="pencil-simple" size="sm" /></Button>
        </Tooltip>
        <Tooltip content="Delete" placement="top">
          <Button dense destructive aria-label="Delete" @click="onDelete(item)"><Icon name="trash" size="sm" /></Button>
        </Tooltip>
      </div>
    </template>
  </DataTable>
`;

/**
 * When the columns don't fit side by side, each row turns into a card instead
 * of the table scrolling sideways: the first column becomes its title, the
 * actions sit beside it, and the other columns are listed with their labels.
 * Sortable columns stay available as a row of sort toggles. Drag the corner
 * of the frame to resize it.
 */
export const Responsive: Story = {
  args: {
    columns: projectColumns,
    items: projects,
  },
  render: (args) => ({
    components: { DataTable, Badge, Button, Icon, Tooltip },
    setup: () => ({ args, statusVariants, onEdit, onDelete }),
    template: `
      <div class="max-w-full resize-x overflow-hidden rounded-[14px] border border-dashed border-neutral-300 squircle dark:border-neutral-700" style="width: 360px">
        ${projectTemplate}
      </div>
    `,
  }),
};

/** `stack: "always"` shows the cards at every width, e.g. in a narrow side panel. */
export const Stacked: Story = {
  args: {
    columns: projectColumns,
    items: projects,
    stack: "always",
  },
  render: (args) => ({
    components: { DataTable, Badge, Button, Icon, Tooltip },
    setup: () => ({ args, statusVariants, onEdit, onDelete }),
    template: projectTemplate,
  }),
};
