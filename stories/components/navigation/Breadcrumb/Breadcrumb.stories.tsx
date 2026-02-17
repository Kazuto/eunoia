import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Breadcrumb from "./Breadcrumb.vue";

const meta = {
  component: Breadcrumb,
  tags: ["autodocs"],
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Breadcrumb
      items={[
        { label: "Home", href: "/" },
        { label: "Products", href: "/products" },
        { label: "Headphones" },
      ]}
    />
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Breadcrumb
      items={[
        { label: "Home", href: "/", icon: "house-simple" },
        { label: "Products", href: "/products", icon: "barcode" },
        { label: "Headphones", icon: "headphones" },
      ]}
    />
  ),
};

export const CustomSeparator: Story = {
  render: () => (
    <Breadcrumb
      separator="arrow-right"
      items={[
        { label: "Home", href: "/" },
        { label: "Products", href: "/products" },
        { label: "Headphones" },
      ]}
    />
  ),
};

export const SingleItem: Story = {
  render: () => <Breadcrumb items={[{ label: "Home" }]} />,
};

export const LongTrail: Story = {
  render: () => (
    <Breadcrumb
      items={[
        { label: "Home", href: "/" },
        { label: "Electronics", href: "/electronics" },
        { label: "Audio", href: "/electronics/audio" },
        { label: "Headphones", href: "/electronics/audio/headphones" },
        { label: "Wireless", href: "/electronics/audio/headphones/wireless" },
        { label: "Sony WH-1000XM5" },
      ]}
    />
  ),
};
