import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Menu from "./Menu.vue";

const meta = {
  component: Menu,
  tags: ["autodocs"],
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Menu
      items={[
        { label: "Home", href: "/", icon: "house-simple" },
        { label: "About", href: "/about", icon: "user" },
        { label: "Team", href: "/team", icon: "users" },
        { label: "History", href: "/history", icon: "clock" },
      ]}
    />
  ),
};

export const Collapsible: Story = {
  render: () => (
    <Menu
      items={[
        { label: "Home", href: "/", icon: "house-simple" },
        {
          label: "About",
          icon: "user",
          items: [
            { label: "Team", href: "/about/team", icon: "users" },
            { label: "History", href: "/about/history", icon: "clock" },
          ],
        },
      ]}
    />
  ),
};

export const Nested: Story = {
  render: () => (
    <Menu
      items={[
        { label: "Home", href: "/", icon: "house-simple" },
        {
          label: "About",
          icon: "user",
          items: [
            { label: "Team", href: "/about/team", icon: "users" },
            {
              label: "History",
              href: "/about/history",
              icon: "clock",
              items: [
                { label: "2022", href: "/about/history/2022" },
                { label: "2021", href: "/about/history/2021" },
                { label: "2020", href: "/about/history/2020" },
              ],
            },
            {
              label: "Contact",
              href: "/about/contact",
              icon: "paper-plane-tilt",
            },
          ],
        },
        {
          label: "Products",
          icon: "barcode",
          items: [
            { label: "Product 1", href: "/products/1" },
            { label: "Product 2", href: "/products/2" },
            { label: "Product 3", href: "/products/3" },
          ],
        },
      ]}
    />
  ),
};
