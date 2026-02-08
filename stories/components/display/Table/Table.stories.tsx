import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Table from "./Table.vue";

const headers = [
  { title: "Name", key: "name" },
  { title: "Role", key: "role" },
  { title: "Email", key: "email" },
];

const items = [
  { name: "Alice Johnson", role: "Engineer", email: "alice@example.com" },
  { name: "Bob Smith", role: "Designer", email: "bob@example.com" },
  { name: "Carol White", role: "Manager", email: "carol@example.com" },
];

const meta = {
  component: Table,
  tags: ["autodocs"],
  argTypes: {
    headers: { control: "object" },
    items: { control: "object" },
    dense: { control: "boolean" },
    loading: { control: "boolean" },
    loadingRows: { control: "number" },
  },
  args: {
    headers,
    items,
    dense: false,
    loading: false,
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dense: Story = {
  args: {
    dense: true,
  },
};

export const Numbers: Story = {
  args: {
    headers: [
      { title: "Product", key: "product" },
      { title: "Quantity", key: "qty" },
      { title: "Price", key: "price" },
    ],
    items: [
      { product: "Widget A", qty: 150, price: 9.99 },
      { product: "Widget B", qty: 42, price: 24.5 },
      { product: "Widget C", qty: 300, price: 4.75 },
    ],
  },
};

export const Empty: Story = {
  args: {
    items: [],
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const LoadingCustomRows: Story = {
  args: {
    loading: true,
    loadingRows: 5,
  },
};
