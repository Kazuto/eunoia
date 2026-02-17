import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Avatar from "./Avatar.vue";

const meta = {
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {
    src: { control: "text" },
    name: { control: "text" },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
  },
  args: {
    src: "https://i.pravatar.cc/150?u=eunoia",
    name: "Jane Doe",
    size: "md",
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Fallback: Story = {
  args: {
    src: undefined,
    name: "Jane Doe",
  },
};

export const SingleName: Story = {
  args: {
    src: undefined,
    name: "Jane",
  },
};

export const NoNameNoImage: Story = {
  args: {
    src: undefined,
    name: undefined,
  },
};

export const Sizes: Story = {
  render: (args: any) => ({
    setup() {
      const sizes = ["xs", "sm", "md", "lg", "xl"] as const;
      return () => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {sizes.map((size) => (
            <Avatar
              key={size}
              {...args}
              size={size}
            />
          ))}
        </div>
      );
    },
  }),
  args: {
    src: "https://i.pravatar.cc/150?u=eunoia",
    name: "Jane Doe",
  },
};

export const SizesFallback: Story = {
  render: (args: any) => ({
    setup() {
      const sizes = ["xs", "sm", "md", "lg", "xl"] as const;
      return () => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {sizes.map((size) => (
            <Avatar
              key={size}
              {...args}
              size={size}
            />
          ))}
        </div>
      );
    },
  }),
  args: {
    src: undefined,
    name: "Jane Doe",
  },
};

export const ImageError: Story = {
  args: {
    src: "https://broken.invalid/404.png",
    name: "Jane Doe",
  },
};
