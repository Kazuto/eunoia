import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Image from "./Image.vue";

const SAMPLE_SRC =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop";

const meta = {
  component: Image,
  tags: ["autodocs"],
  argTypes: {
    src: { control: "text" },
    alt: { control: "text" },
    width: { control: "text" },
    height: { control: "text" },
    loading: {
      control: "select",
      options: ["lazy", "eager"],
    },
    fetchpriority: {
      control: "select",
      options: ["high", "low", "auto"],
    },
    rounded: {
      control: "select",
      options: [false, true, "full"],
    },
    fit: {
      control: "select",
      options: ["cover", "contain", "fill", "none"],
    },
  },
  args: {
    src: SAMPLE_SRC,
    alt: "Sample image",
    width: 200,
    height: 200,
  },
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Rounded: Story = {
  args: {
    rounded: true,
  },
};

export const Circle: Story = {
  args: {
    rounded: "full",
  },
};

export const LazyLoading: Story = {
  args: {
    loading: "lazy",
  },
};

export const HighPriority: Story = {
  args: {
    fetchpriority: "high",
    loading: "eager",
  },
};
