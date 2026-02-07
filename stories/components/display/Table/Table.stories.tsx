import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Table from "./Table.vue";

const columns = [
  { name: "Name", key: "name" },
  { name: "Role", key: "role" },
  { name: "Email", key: "email" },
];

const rows = [
  { name: "Alice Johnson", role: "Engineer", email: "alice@example.com" },
  { name: "Bob Smith", role: "Designer", email: "bob@example.com" },
  { name: "Carol White", role: "Manager", email: "carol@example.com" },
];

const meta = {
  component: Table,
  tags: ["autodocs"],
  argTypes: {
    columns: { control: "object" },
    rows: { control: "object" },
    dense: { control: "boolean" },
  },
  args: {
    columns,
    rows,
    dense: false,
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
    columns: [
      { name: "Product", key: "product" },
      { name: "Quantity", key: "qty" },
      { name: "Price", key: "price" },
    ],
    rows: [
      { product: "Widget A", qty: 150, price: 9.99 },
      { product: "Widget B", qty: 42, price: 24.5 },
      { product: "Widget C", qty: 300, price: 4.75 },
    ],
  },
};

export const Empty: Story = {
  args: {
    rows: [],
  },
};
