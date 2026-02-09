import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Link from "./Link.vue";

const meta = {
  component: Link,
  tags: ["autodocs"],
  argTypes: {
    href: { control: "text" },
    external: { control: "boolean" },
    dense: { control: "boolean" },
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
    href: "/about",
    default: "About us",
    dense: false,
  },
  render: (args: any) => ({
    setup() {
      return () => (
        <Link {...args}>
          {{
            default: () => args.default,
          }}
        </Link>
      );
    },
  }),
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Internal: Story = {};

export const External: Story = {
  args: {
    href: "https://example.com",
    default: "Visit Example",
  },
};

export const ExternalForced: Story = {
  args: {
    href: "/api/download",
    default: "Download file",
    external: true,
  },
};

export const Dense: Story = {
  args: {
    dense: true,
  },
};

export const InParagraph: Story = {
  render: (args: any) => ({
    setup() {
      return () => (
        <p class="text-sm text-gray-700">
          Please read our{" "}
          <Link href="https://example.com/terms">terms and conditions</Link>{" "}
          before proceeding.
        </p>
      );
    },
  }),
};
