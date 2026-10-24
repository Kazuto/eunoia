<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from "vue";
import {
  BottomNav,
  Header,
  Menu,
  Page,
  Sidebar,
  SidebarToggle,
  UserMenu,
} from "@/components";
import type { BottomNavItem, MenuItem, UserMenuItem } from "@/components";
import type { HeaderOptions } from "@/components/layout/Header/Header.vue";

/**
 * The frame every example page shares: a header with the page's title and
 * actions, the sidebar on wide screens, and the bottom navigation on phones.
 */
const props = withDefaults(
  defineProps<
    Omit<HeaderOptions, "width" | "alignTo"> & {
      /** Marks the current page in the navigation. */
      currentPath: string;
      /** The page's width; the header's title lines up with it. */
      width?: "narrow" | "wide" | "extra-wide";
    }
  >(),
  { width: "wide" }
);

const emit = defineEmits<{
  /** A link inside the app was followed, e.g. to hand it to a router. */
  (e: "navigate", path: string): void;
  (e: "account", label: string): void;
}>();

const headerProps = computed(() => {
  const { currentPath: _, width: __, ...rest } = props;

  return rest;
});

const menuItems: MenuItem[] = [
  { label: "Dashboard", href: "/", icon: "house-simple" },
  { label: "Employees", href: "/employees", icon: "users" },
  { label: "Projects", href: "/projects", icon: "folder" },
  { label: "Settings", href: "/settings", icon: "gear" },
];

const bottomNavItems: BottomNavItem[] = menuItems.map(
  ({ label, href, icon }) => ({ label, href, icon })
);

const userMenuItems: UserMenuItem[] = [
  { label: "Profile", icon: "user" },
  { label: "Account Settings", icon: "gear" },
  { label: "Sign Out", icon: "sign-out", variant: "danger" },
];

const sidebarCollapsed = ref(false);
const main = useTemplateRef<HTMLElement>("main");

// Below md, the sidebar gives way to the bottom navigation.
const desktop = ref(true);
let desktopQuery: MediaQueryList | undefined;
const updateDesktop = () => (desktop.value = desktopQuery?.matches ?? true);

onMounted(() => {
  desktopQuery = window.matchMedia("(min-width: 48rem)");
  updateDesktop();
  desktopQuery.addEventListener("change", updateDesktop);
});
onBeforeUnmount(() =>
  desktopQuery?.removeEventListener("change", updateDesktop)
);

// Stands in for a router, as these links lead nowhere inside Storybook.
function followLink(event: MouseEvent) {
  const href = (event.target as Element)
    .closest("a[href]")
    ?.getAttribute("href");
  if (!href?.startsWith("/")) return;

  event.preventDefault();
  emit("navigate", href);
}
</script>

<template>
  <div
    class="flex h-svh flex-col bg-white font-sans dark:bg-neutral-950"
    @click.capture="followLink"
  >
    <Header
      v-bind="headerProps"
      :width
      :align-to="main"
    >
      <template
        v-if="desktop"
        #left
      >
        <SidebarToggle v-model:collapsed="sidebarCollapsed" />
      </template>
      <template #right>
        <slot name="header-right">
          <UserMenu
            name="Alice Johnson"
            :items="userMenuItems"
            @select="emit('account', $event)"
          />
        </slot>
      </template>
    </Header>

    <div class="flex min-h-0 flex-1">
      <Sidebar
        v-if="desktop"
        v-model:collapsed="sidebarCollapsed"
      >
        <Menu
          class="p-3"
          :items="menuItems"
          :current-path
        />
      </Sidebar>

      <main
        ref="main"
        class="min-w-0 flex-1 overflow-y-auto"
      >
        <Page
          :show-header="false"
          :width
        >
          <slot />
        </Page>
      </main>
    </div>

    <BottomNav
      v-if="!desktop"
      :items="bottomNavItems"
      :current-path
    />
  </div>
</template>
