import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { Page, Card, DataTable } from "@/components";

const meta = {
  component: Page,
  argTypes: {
    backAction: {
      control: "object",
      options: ["content", "onClick", "icon", "disabled"],
    },
    primaryAction: {
      control: "object",
      options: ["content", "onClick", "icon", "disabled"],
    },
    secondaryActions: {
      control: "object",
      options: ["content", "onClick", "icon", "disabled"],
    },
    copyAction: {
      control: "object",
      options: ["content", "onClick", "icon", "disabled"],
    },
    title: {
      control: "text",
    },
  },
  args: {
    backAction: {
      content: "Back",
      icon: "arrow-left",
      onClick: () => console.log("Back"),
    },
    primaryAction: {
      content: "Primary",
      icon: "check",
      onClick: () => console.log("Primary"),
    },
    secondaryActions: [
      {
        content: "Secondary 1",
        icon: "check",
        onClick: () => console.log("Secondary 1"),
      },
      {
        content: "Secondary 2",
        icon: "check",
        onClick: () => console.log("Secondary 2"),
      },
    ],
    copyAction: {
      content: "Copy",
      icon: "copy",
      onClick: () => console.log("Copy"),
    },
    title: "Page Title",
  },
  render: (args) => ({
    components: { Page, Card, DataTable },
    setup() {
      const dataTableColumns = [
        { title: "Name", key: "name", sortable: true },
        { title: "Role", key: "role", sortable: true },
        { title: "Department", key: "department", sortable: true },
        {
          title: "Salary",
          key: "salary",
          sortable: true,
          align: "end" as const,
          value: (item: Record<string, unknown>) =>
            `$${(item.salary as number).toLocaleString()}`,
        },
        { title: "Status", key: "status", sortable: true },
      ];

      const dataTableItems = [
        {
          name: "Alice Johnson",
          role: "Engineer",
          department: "Platform",
          salary: 95000,
          status: "Active",
        },
        {
          name: "Bob Smith",
          role: "Designer",
          department: "Product",
          salary: 82000,
          status: "Active",
        },
        {
          name: "Carol White",
          role: "Manager",
          department: "Engineering",
          salary: 110000,
          status: "On Leave",
        },
        {
          name: "David Lee",
          role: "Engineer",
          department: "Platform",
          salary: 98000,
          status: "Active",
        },
        {
          name: "Eva Martinez",
          role: "QA",
          department: "Quality",
          salary: 78000,
          status: "Active",
        },
      ];

      return { args, dataTableColumns, dataTableItems };
    },
    template: `
      <Page v-bind="args">
        <template #default>
          <div class="flex flex-col gap-6">
            <Card title="Some information">
              <p class="text-neutral-500">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <p class="text-neutral-500">
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </Card>

            <Card title="A data table">
              <DataTable :columns="dataTableColumns"
                :items="dataTableItems"
              />
            </Card>

            <Card title="Another card with some content">
              <p class="text-neutral-500">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <p class="text-neutral-500">
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p class="text-neutral-500">
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur.
              </p>
            </Card>
          </div>
        </template>
      </Page>
    `,
  }),
  parameters: {
    layout: "fullscreen",
    unwrapped: true,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: {
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
};

export const TruncatedTitle: Story = {
  args: {
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    truncateTitleAfter: 20,
  },
};
