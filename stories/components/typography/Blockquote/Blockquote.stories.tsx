import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Blockquote from "./Blockquote.vue";

const meta = {
  component: Blockquote,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "pull"] },
    author: { control: "text" },
    source: { control: "text" },
    cite: { control: "text" },
    default: {
      control: "text",
      description: "The quotation",
      table: {
        category: "slots",
        type: { summary: "html" },
      },
    },
  },
  args: {
    variant: "default",
    author: "Robert Bringhurst",
    source: "The Elements of Typographic Style",
    default:
      "Typography exists to honor content. Like oratory, music, dance, calligraphy, it can lend its charm to language.",
  },
  render: (args: any) => ({
    setup() {
      return () => (
        <Blockquote {...args}>
          {{
            default: () => args.default,
          }}
        </Blockquote>
      );
    },
  }),
} satisfies Meta<typeof Blockquote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const PullQuote: Story = {
  args: {
    variant: "pull",
    author: "Ada Lovelace",
    source: undefined,
    default:
      "The more I study, the more insatiable do I feel my genius for it to be.",
  },
};

export const PullQuoteParagraphs: Story = {
  args: {
    variant: "pull",
    author: "Ada Lovelace",
    source: undefined,
  },
  render: (args: any) => ({
    setup() {
      return () => (
        <Blockquote {...args}>
          <p>
            The more I study, the more insatiable do I feel my genius for it to
            be.
          </p>
        </Blockquote>
      );
    },
  }),
};

export const WithoutAttribution: Story = {
  args: {
    author: undefined,
    source: undefined,
  },
};
