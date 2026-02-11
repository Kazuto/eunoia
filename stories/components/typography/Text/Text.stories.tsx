import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Text from "./Text.vue";

const meta = {
  component: Text,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "base", "lg"],
    },
    muted: { control: "boolean" },
    default: {
      control: "text",
      description: "Default slot content",
      table: {
        category: "slots",
        type: { summary: "html" },
      },
    },
  },
  args: {
    size: "base",
    muted: false,
    default:
      "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.",
  },
  render: (args: any) => ({
    setup() {
      return () => <Text {...args}>{args.default}</Text>;
    },
  }),
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: { size: "sm" },
};

export const Large: Story = {
  args: { size: "lg" },
};

export const Muted: Story = {
  args: { muted: true },
};

export const MutedSmall: Story = {
  args: { size: "sm", muted: true },
};
