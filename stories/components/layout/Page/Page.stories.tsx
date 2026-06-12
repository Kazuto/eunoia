import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { Page } from "@/components";

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
  render: () => ({
    components: { Page },
  }),
  parameters: {
    layout: "fullscreen",
    unwrapped: true,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args: any) => ({
    setup() {
      return () => <Page {...args}></Page>;
    },
  }),
};
