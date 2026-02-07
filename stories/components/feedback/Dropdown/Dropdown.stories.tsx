import { fn } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Dropdown from "./Dropdown.vue";

const defaultItems = [
  { label: "Edit", value: "edit" },
  { label: "Duplicate", value: "duplicate" },
  { label: "Archive", value: "archive" },
  { label: "Delete", value: "delete", variant: "danger" as const },
];

const meta = {
  component: Dropdown,
  tags: ["autodocs"],
  argTypes: {
    items: { control: "object" },
    dense: { control: "boolean" },
    disabled: { control: "boolean" },
    trigger: {
      control: "text",
      description: "Trigger slot content",
      table: {
        category: "slots",
        type: { summary: "html" },
      },
    },
  },
  args: {
    items: defaultItems,
    dense: false,
    disabled: false,
    trigger: "Options",
    onSelect: fn(),
  },
  render: (args: any) => ({
    setup() {
      return () => (
        <Dropdown {...args}>
          {{
            trigger: () => args.trigger,
          }}
        </Dropdown>
      );
    },
  }),
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dense: Story = {
  args: {
    dense: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithDisabledItems: Story = {
  args: {
    items: [
      { label: "Edit", value: "edit" },
      { label: "Duplicate", value: "duplicate", disabled: true },
      { label: "Archive", value: "archive" },
      { label: "Delete", value: "delete", variant: "danger" as const },
    ],
  },
};

export const DangerItems: Story = {
  args: {
    items: [
      { label: "Remove from list", value: "remove", variant: "danger" as const },
      { label: "Delete permanently", value: "delete", variant: "danger" as const },
    ],
    trigger: "Danger actions",
  },
};
