import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";

import Sidebar from "./Sidebar.vue";
import SidebarToggle from "./primitives/SidebarToggle.vue";
import Menu from "@/components/navigation/Menu/Menu.vue";
import type { MenuItem } from "@/components/navigation/Menu/types";

const menuItems: MenuItem[] = [
  { label: "Dashboard", href: "/", icon: "house-simple" },
  { label: "Projects", href: "/projects", icon: "folder" },
  { label: "Settings", href: "/settings", icon: "gear" },
];

const meta = {
  component: Sidebar,
  tags: ["autodocs"],
  argTypes: {
    collapsed: { control: "boolean" },
    default: {
      control: false,
      description: "Main sidebar content",
      table: { category: "slots", type: { summary: "html" } },
    },
    footer: {
      control: false,
      description: "Footer content, rendered below a divider",
      table: { category: "slots", type: { summary: "html" } },
    },
  },
  args: {
    collapsed: false,
  },
  parameters: {
    layout: "fullscreen",
    unwrapped: true,
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args: any) => ({
    setup() {
      return () => (
        <div
          style={{ display: "flex", height: "100vh", flexDirection: "column" }}
        >
          <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
            <Sidebar {...args}>
              <Menu
                class="p-3"
                items={menuItems}
                currentPath="/"
              />
            </Sidebar>
            <div style={{ flex: 1, padding: "24px", overflow: "auto" }}>
              <p class="text-neutral-500">Main content area</p>
            </div>
          </div>
        </div>
      );
    },
  }),
};

export const WithFooter: Story = {
  render: (args: any) => ({
    setup() {
      return () => (
        <div
          style={{ display: "flex", height: "100vh", flexDirection: "column" }}
        >
          <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
            <Sidebar {...args}>
              {{
                default: () => (
                  <Menu
                    class="p-3"
                    items={menuItems}
                    currentPath="/"
                  />
                ),
                footer: () => (
                  <div class="flex items-center gap-3">
                    <div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-white">
                      JD
                    </div>
                    <div class="text-sm">
                      <p class="font-medium text-neutral-900 dark:text-neutral-100">
                        John Doe
                      </p>
                      <p class="text-xs text-neutral-500">john@example.com</p>
                    </div>
                  </div>
                ),
              }}
            </Sidebar>
            <div style={{ flex: 1, padding: "24px", overflow: "auto" }}>
              <p class="text-neutral-500">Main content area</p>
            </div>
          </div>
        </div>
      );
    },
  }),
};

export const Collapsed: Story = {
  args: {
    collapsed: true,
  },
  render: (args: any) => ({
    setup() {
      return () => (
        <div
          style={{ display: "flex", height: "100vh", flexDirection: "column" }}
        >
          <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
            <Sidebar {...args}>
              <Menu
                class="p-3"
                items={menuItems}
                currentPath="/"
              />
            </Sidebar>
            <div style={{ flex: 1, padding: "24px", overflow: "auto" }}>
              <p class="text-neutral-500">Main content area</p>
            </div>
          </div>
        </div>
      );
    },
  }),
};

export const PageLayout: Story = {
  render: () => ({
    setup() {
      const collapsed = ref(false);
      return () => (
        <div
          style={{ display: "flex", height: "100vh", flexDirection: "column" }}
        >
          <header class="flex h-14 shrink-0 items-center gap-3 border-b border-neutral-200 bg-white px-4 dark:border-neutral-700 dark:bg-neutral-900">
            <SidebarToggle v-model:collapsed={collapsed.value} />
            <span class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Acme Inc.
            </span>
          </header>
          <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
            <Sidebar v-model:collapsed={collapsed.value}>
              <Menu
                class="p-3"
                items={menuItems}
                currentPath="/"
              />
            </Sidebar>
            <main style={{ flex: 1, padding: "24px", overflow: "auto" }}>
              <h1 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Dashboard
              </h1>
              <p class="mt-2 text-sm text-neutral-500">
                This story demonstrates using SidebarToggle in the header to
                control the sidebar — both share the same collapsed ref.
              </p>
            </main>
          </div>
        </div>
      );
    },
  }),
};
