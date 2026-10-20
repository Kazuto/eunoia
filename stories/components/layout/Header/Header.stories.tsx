import { fn } from "storybook/test";
import { ref } from "vue";
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

export const Transparent: Story = {
  args: {
    transparent: true,
  },
};

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

/**
 * With `width` and `alignTo`, the title and actions line up with a `Page` of the same width
 * inside `alignTo`, while the left and right slots stay at the header's edges.
 */
export const AlignedWithPage: Story = {
  args: { width: "extra-wide" },
  render: (args) => ({
    components: { Header, Page, Card, Button },
    setup() {
      const main = ref<HTMLElement | null>(null);
      return { args, main };
    },
    template: `
      <div class="flex h-screen flex-col bg-neutral-100 dark:bg-neutral-950">
        <Header v-bind="args" :align-to="main">
          <template #left>
            <Button ghost icon="sidebar" aria-label="Toggle sidebar" />
          </template>
          <template #right>
            <Button ghost>Jane Doe</Button>
          </template>
        </Header>
        <div class="flex min-h-0 flex-1">
          <aside data-testid="sidebar" class="w-48 shrink-0 border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900" />
          <main ref="main" class="min-w-0 flex-1 overflow-y-auto">
            <Page :show-header="false" :width="args.width">
              <Card data-testid="content">
                <p class="text-sm text-neutral-500">The header's title and actions share this card's edges.</p>
              </Card>
            </Page>
          </main>
        </div>
      </div>
    `,
  }),
};
