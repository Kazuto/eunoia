import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Card from "./Card.vue";

const meta = {
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    dense: { control: "boolean" },
    default: {
      control: "text",
      description: "Body content",
      table: { category: "slots" },
    },
    header: {
      description: "Header slot (rendered alongside title)",
      table: { category: "slots" },
    },
    footer: {
      description: "Footer slot",
      table: { category: "slots" },
    },
  },
  args: {
    title: "Card Title",
    default: "This is the card body content. It can contain any text or components.",
    dense: false,
  },
  render: (args: any) => ({
    components: { Card },
    setup: () => ({ args }),
    template: `
      <Card v-bind="args">
        {{ args.default }}
      </Card>
    `,
  }),
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dense: Story = {
  args: {
    dense: true,
  },
};

export const WithFooter: Story = {
  render: (args: any) => ({
    components: { Card },
    setup: () => ({ args }),
    template: `
      <Card v-bind="args">
        {{ args.default }}
        <template #footer>
          <button class="text-sm font-semibold text-primary hover:underline">Learn more</button>
        </template>
      </Card>
    `,
  }),
};

export const WithHeaderSlot: Story = {
  render: (args: any) => ({
    components: { Card },
    setup: () => ({ args }),
    template: `
      <Card v-bind="args">
        {{ args.default }}
        <template #header>
          <span class="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">Active</span>
        </template>
      </Card>
    `,
  }),
};

export const NoTitle: Story = {
  args: {
    title: undefined,
  },
};
