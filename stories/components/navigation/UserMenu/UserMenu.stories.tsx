import { fn } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import UserMenu from "./UserMenu.vue";

const defaultItems = [
  { label: "Profile", href: "/profile" },
  { label: "Settings", href: "/settings" },
  { label: "Sign out", variant: "danger" as const },
];

const itemsWithIcons = [
  { label: "Profile", href: "/profile", icon: "user" },
  { label: "Settings", href: "/settings", icon: "gear" },
  { label: "Help", href: "/help", icon: "question" },
  { label: "Sign out", variant: "danger" as const, icon: "sign-out" },
];

const meta = {
  component: UserMenu,
  tags: ["autodocs"],
  argTypes: {
    image: { control: "text" },
    name: { control: "text" },
    items: { control: "object" },
    dense: { control: "boolean" },
  },
  args: {
    image: "https://i.pravatar.cc/150?u=eunoia",
    name: "Jane Doe",
    items: defaultItems,
    dense: false,
    onSelect: fn(),
  },
} satisfies Meta<typeof UserMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ImageOnly: Story = {
  args: {
    name: undefined,
  },
};

export const WithIcons: Story = {
  args: {
    items: itemsWithIcons,
  },
};

export const NoImage: Story = {
  args: {
    image: undefined,
    name: "Jane Doe",
  },
};

export const DangerItem: Story = {
  args: {
    items: [
      { label: "Profile", href: "/profile" },
      { label: "Sign out", variant: "danger" as const },
    ],
  },
};
