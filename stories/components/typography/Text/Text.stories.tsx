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
    weight: {
      control: "select",
      options: [undefined, "normal", "medium", "semibold", "bold"],
    },
    as: { control: "text" },
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

export const Weights: Story = {
  render: () => ({
    setup() {
      return () => (
        <div>
          <Text weight="normal">Normal weight</Text>
          <Text weight="medium">Medium weight</Text>
          <Text weight="semibold">Semibold weight</Text>
          <Text weight="bold">Bold weight</Text>
        </div>
      );
    },
  }),
};

export const Inline: Story = {
  render: () => ({
    setup() {
      return () => (
        <Text>
          Signed in as{" "}
          <Text
            as="span"
            weight="semibold"
          >
            ada@example.com
          </Text>
          .
        </Text>
      );
    },
  }),
};
