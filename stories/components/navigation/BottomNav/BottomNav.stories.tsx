import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref, watch } from "vue";

import BottomNav, { type BottomNavItem } from "./BottomNav.vue";
import Sidebar from "@/components/layout/Sidebar/Sidebar.vue";
import Menu from "@/components/navigation/Menu/Menu.vue";

const items: BottomNavItem[] = [
  { label: "Home", href: "/", icon: "house" },
  { label: "Search", href: "/search", icon: "magnifying-glass" },
  { label: "Inbox", href: "/inbox", icon: "bell", badge: 3 },
  { label: "Profile", href: "/profile", icon: "user" },
];

const manyItems: BottomNavItem[] = [
  { label: "Home", href: "/", icon: "house" },
  { label: "Projects", href: "/projects", icon: "folder" },
  { label: "Calendar", href: "/calendar", icon: "calendar-blank" },
  { label: "Inbox", href: "/inbox", icon: "bell" },
  { label: "Reports", href: "/reports", icon: "chart-bar" },
  { label: "Team", href: "/team", icon: "users" },
  { label: "Settings", href: "/settings", icon: "gear" },
];

// Stands in for the router: links set the current path instead of leaving the story.
function useFakeRouter(initial: () => string | undefined) {
  const currentPath = ref(initial());
  watch(initial, (path) => (currentPath.value = path));

  function navigate(event: Event) {
    const link = (event.target as Element).closest("a[href]");
    if (!link) return;
    event.preventDefault();
    currentPath.value = link.getAttribute("href") ?? undefined;
  }

  return { currentPath, navigate };
}

const placeholders = Array.from({ length: 12 }, (_, index) => index);

const meta = {
  component: BottomNav,
  tags: ["autodocs"],
  argTypes: {
    items: { control: "object" },
    currentPath: { control: "text" },
    max: { control: { type: "number", min: 2, max: 7 } },
    ariaLabel: { control: "text" },
    dense: { control: "boolean" },
  },
  args: {
    items,
    currentPath: "/",
    max: 5,
    dense: false,
  },
  parameters: {
    layout: "fullscreen",
    unwrapped: true,
    // The bar is fixed to the viewport, so each docs example needs its own frame.
    docs: { story: { inline: false, height: "560px" } },
  },
  globals: {
    viewport: { value: "mobile2", isRotated: false },
  },
  render: (args: any) => ({
    setup() {
      const { currentPath, navigate } = useFakeRouter(() => args.currentPath);

      return () => (
        <div
          class="flex min-h-svh flex-col font-sans"
          onClickCapture={navigate}
        >
          <header class="sticky top-0 border-b border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
            {currentPath.value}
          </header>
          <main class="flex flex-1 flex-col gap-3 p-4">
            {placeholders.map((index) => (
              <div
                key={index}
                class="h-20 shrink-0 rounded-[14px] bg-neutral-100 squircle dark:bg-neutral-800"
              />
            ))}
          </main>
          <BottomNav
            {...args}
            currentPath={currentPath.value}
          />
        </div>
      );
    },
  }),
} satisfies Meta<typeof BottomNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** On a page below a destination, the destination stays highlighted. */
export const Subpage: Story = {
  args: {
    items: manyItems.slice(0, 4),
    currentPath: "/projects/42",
  },
};

/** Items past `max` move into a "More" drawer, which highlights while one of them is open. */
export const More: Story = {
  args: {
    items: manyItems,
    currentPath: "/settings",
  },
};

export const Badges: Story = {
  args: {
    items: [
      { label: "Home", href: "/", icon: "house" },
      { label: "Inbox", href: "/inbox", icon: "bell", badge: 3 },
      { label: "Chat", href: "/chat", icon: "chat-circle", badge: 128 },
      { label: "Updates", href: "/updates", icon: "sparkle", badge: true },
    ],
  },
};

export const Dense: Story = {
  args: { dense: true },
};

/**
 * The same items drive a `Sidebar` on wide screens and the bottom bar on
 * phones. Resize the preview, or switch the viewport, to see them swap.
 */
export const WithSidebar: Story = {
  args: {
    items: manyItems.slice(0, 5),
  },
  globals: {
    viewport: { value: "desktop", isRotated: false },
  },
  render: (args: any) => ({
    setup() {
      const { currentPath, navigate } = useFakeRouter(() => args.currentPath);

      return () => (
        <div
          class="flex h-svh font-sans"
          onClickCapture={navigate}
        >
          <Sidebar class="hidden md:flex">
            <Menu
              class="p-3"
              items={args.items}
              currentPath={currentPath.value}
            />
          </Sidebar>
          <div class="flex min-w-0 flex-1 flex-col">
            <main class="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
              {placeholders.map((index) => (
                <div
                  key={index}
                  class="h-20 shrink-0 rounded-[14px] bg-neutral-100 squircle dark:bg-neutral-800"
                />
              ))}
            </main>
            <BottomNav
              {...args}
              class="md:hidden"
              currentPath={currentPath.value}
            />
          </div>
        </div>
      );
    },
  }),
};
