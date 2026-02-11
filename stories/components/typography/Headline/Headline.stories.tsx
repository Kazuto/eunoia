import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Headline from "./Headline.vue";

const meta = {
  component: Headline,
  tags: ["autodocs"],
  argTypes: {
    level: {
      control: "select",
      options: [1, 2, 3, 4, 5, 6],
    },
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
    level: 1,
    default: "The quick brown fox jumps over the lazy dog",
  },
  render: (args: any) => ({
    setup() {
      return () => (
        <Headline {...args}>
          {args.default}
        </Headline>
      );
    },
  }),
} satisfies Meta<typeof Headline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const H1: Story = {
  args: { level: 1 },
};

export const H2: Story = {
  args: { level: 2 },
};

export const H3: Story = {
  args: { level: 3 },
};

export const H4: Story = {
  args: { level: 4 },
};

export const H5: Story = {
  args: { level: 5 },
};

export const H6: Story = {
  args: { level: 6 },
};

export const AllLevels: Story = {
  render: () => ({
    setup() {
      return () => (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Headline level={1}>Headline Level 1</Headline>
          <Headline level={2}>Headline Level 2</Headline>
          <Headline level={3}>Headline Level 3</Headline>
          <Headline level={4}>Headline Level 4</Headline>
          <Headline level={5}>Headline Level 5</Headline>
          <Headline level={6}>Headline Level 6</Headline>
        </div>
      );
    },
  }),
};
