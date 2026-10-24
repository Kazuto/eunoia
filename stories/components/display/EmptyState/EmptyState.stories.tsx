import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { Button } from "@/components";
import EmptyState from "./EmptyState.vue";

const meta = {
  component: EmptyState,
  tags: ["autodocs"],
  argTypes: {
    icon: { control: "text" },
    title: { control: "text" },
    description: { control: "text" },
    headingTag: { control: "select", options: ["h2", "h3", "h4", "p"] },
    dense: { control: "boolean" },
  },
  args: {
    icon: "tray",
    title: "No messages yet",
    description: "When someone writes to you, the conversation shows up here.",
    headingTag: "h3",
    dense: false,
  },
  render: (args: any) => ({
    setup() {
      return () => <EmptyState {...args} />;
    },
  }),
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithActions: Story = {
  args: {
    icon: "folder-open",
    title: "No projects",
    description: "Create a project to start organizing your work.",
  },
  render: (args: any) => ({
    setup() {
      return () => (
        <EmptyState {...args}>
          <Button primary>Create project</Button>
          <Button ghost>Import</Button>
        </EmptyState>
      );
    },
  }),
};

export const NoResults: Story = {
  args: {
    icon: "magnifying-glass",
    title: "No results",
    description: "Try a different search term or clear the filters.",
    dense: true,
  },
};

export const DefaultTitle: Story = {
  args: {
    title: undefined,
    description: undefined,
  },
};
