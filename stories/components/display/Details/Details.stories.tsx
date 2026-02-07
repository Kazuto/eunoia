import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Details from "./Details.vue";

const meta = {
  component: Details,
  tags: ["autodocs"],
  argTypes: {
    dense: { control: "boolean" },
    modelValue: { control: "boolean" },
    summary: {
      control: "text",
      description: "Summary slot content (clickable header)",
      table: {
        category: "slots",
        type: { summary: "html" },
      },
    },
    default: {
      control: "text",
      description: "Default slot content (collapsible body)",
      table: {
        category: "slots",
        type: { summary: "html" },
      },
    },
  },
  args: {
    summary: "What is this component?",
    default:
      "A collapsible details component built on the native HTML details element with smooth open/close animations.",
    dense: false,
    modelValue: false,
  },
  render: (args: any) => ({
    setup() {
      return () => (
        <Details {...args}>
          {{
            summary: () => args.summary,
            default: () => args.default,
          }}
        </Details>
      );
    },
  }),
} satisfies Meta<typeof Details>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = {
  args: {
    modelValue: true,
  },
};

export const Dense: Story = {
  args: {
    dense: true,
  },
};

export const LongContent: Story = {
  args: {
    summary: "Terms and conditions",
    default:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
};
