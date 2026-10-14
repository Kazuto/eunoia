import { fn } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { Header, Page, Card, Button } from "@/components";

const meta = {
  component: Header,
  parameters: {
    layout: "fullscreen",
    unwrapped: true,
  },
  tags: ["autodocs"],
  args: {
    title: "Page title",
    description: "A short description of what this page is for",
    backAction: { content: "Back", onClick: fn() },
    primaryAction: {
      content: "Create item",
      icon: "plus",
      onClick: fn(),
    },
  },
  render: (args) => ({
    components: { Header, Page, Card, Button },
    setup() {
      return { args };
    },
    template: `
      <div class="min-h-screen bg-neutral-100 dark:bg-neutral-950">
        <Header v-bind="args">
          <template #left>
            <Button ghost icon="sidebar" aria-label="Toggle sidebar" />
          </template>
          <template #right>
            <Button ghost>Jane Doe</Button>
          </template>
        </Header>
        <Page :show-header="false" width="wide">
          <Card title="Content">
            <p class="text-sm text-neutral-500">Page content starts here. The title, description, and page actions are in the app header.</p>
          </Card>
        </Page>
      </div>
    `,
  }),
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PageContext: Story = {};

export const WithoutDescription: Story = {
  args: {
    description: undefined,
  },
};

export const WithSecondaryActions: Story = {
  args: {
    secondaryActions: [
      { content: "Import", icon: "upload", onClick: fn() },
      { content: "Export", icon: "download", onClick: fn() },
      { content: "Unavailable action", disabled: true, onClick: fn() },
    ],
  },
};

export const WithoutPageContext: Story = {
  render: () => ({
    components: { Header, Button },
    template: `
      <Header title="Overview">
        <template #left>
          <Button ghost icon="sidebar" aria-label="Toggle sidebar" />
        </template>
        <template #right>
          <Button ghost>Jane Doe</Button>
        </template>
      </Header>
    `,
  }),
};
