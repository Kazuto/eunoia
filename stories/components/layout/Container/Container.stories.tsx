import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Container from "./Container.vue";

const meta = {
  component: Container,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "2xl", "full"],
    },
    padded: { control: "boolean" },
    as: { control: "text" },
  },
  args: {
    size: "lg",
    padded: true,
    as: "div",
  },
  render: (args: any) => ({
    setup() {
      return () => (
        <Container {...args}>
          <div class="rounded-[16px] bg-primary-100 p-6 text-sm text-primary-900 squircle dark:bg-primary-900 dark:text-primary-100">
            Content constrained to max-w-screen-{args.size}
          </div>
        </Container>
      );
    },
  }),
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: {
    size: "sm",
  },
};

export const Unpadded: Story = {
  args: {
    padded: false,
  },
};
