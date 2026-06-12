<script lang="ts" setup>
import { ref } from "vue";
import {
  Button,
  Input,
  Select,
  Badge,
  Alert,
  Card,
  DataTable,
  Icon,
  Link,
  Tooltip,
  Sidebar,
  SidebarToggle,
} from "@/components";
import { Header, Menu, UserMenu } from "@/components";
import type { MenuItem, UserMenuItem } from "@/components";

const emit = defineEmits<{
  (e: "view", item: Record<string, unknown>): void;
  (e: "edit", item: Record<string, unknown>): void;
  (e: "delete", item: Record<string, unknown>): void;
}>();

const loggedIn = ref(true);
const sidebarCollapsed = ref(false);

const name = ref("");
const email = ref("invalid-email");
const website = ref("");
const role = ref<string>("");
const department = ref<string>();
const newsletter = ref(false);

const nameErrors = ref<string[]>([]);
const emailErrors = ref(["Please enter a valid email address"]);

const onMenuSelect = (label: string) => {
  if (label === "Sign Out") loggedIn.value = false;
};

const onView = (item: Record<string, unknown>) => emit("view", item);
const onEdit = (item: Record<string, unknown>) => emit("edit", item);
const onDelete = (item: Record<string, unknown>) => emit("delete", item);

const menuItems: MenuItem[] = [
  { label: "Dashboard", href: "/", icon: "house-simple" },
  { label: "Employees", href: "/employees", icon: "users" },
  { label: "Projects", href: "/projects", icon: "folder" },
  {
    label: "Settings",
    href: "/settings",
    icon: "gear",
    items: [
      { label: "Profile", href: "/profile", icon: "user" },
      { label: "Account Settings", href: "/account", icon: "gear" },
      {
        label: "Sign Out",
        href: "/signout",
        icon: "sign-out",
      },
    ],
  },
];

const userMenuItems: UserMenuItem[] = [
  { label: "Profile", icon: "user" },
  { label: "Account Settings", icon: "gear" },
  { label: "Sign Out", icon: "sign-out", variant: "danger" },
];

const departmentOptions = [
  { label: "Engineering", value: "engineering" },
  { label: "Product", value: "product" },
  { label: "Design", value: "design" },
];

const roleOptions = [
  { label: "Engineer", value: "engineer" },
  { label: "Designer", value: "designer" },
  { label: "Manager", value: "manager" },
  { label: "QA", value: "qa" },
];

const columns = [
  { title: "Name", key: "name", sortable: true },
  { title: "Role", key: "role", sortable: true },
  { title: "Department", key: "department", sortable: true },
  {
    title: "Salary",
    key: "salary",
    sortable: true,
    align: "end" as const,
    value: (item: Record<string, unknown>) =>
      `$${(item.salary as number).toLocaleString()}`,
  },
  { title: "Status", key: "status", sortable: true },
];

const items = [
  {
    name: "Alice Johnson",
    role: "Engineer",
    department: "Platform",
    salary: 95000,
    status: "Active",
  },
  {
    name: "Bob Smith",
    role: "Designer",
    department: "Product",
    salary: 82000,
    status: "Active",
  },
  {
    name: "Carol White",
    role: "Manager",
    department: "Engineering",
    salary: 110000,
    status: "On Leave",
  },
  {
    name: "David Lee",
    role: "Engineer",
    department: "Platform",
    salary: 98000,
    status: "Active",
  },
  {
    name: "Eva Martinez",
    role: "QA",
    department: "Quality",
    salary: 78000,
    status: "Active",
  },
];
</script>
<template>
  <div class="flex h-screen flex-col bg-white font-sans dark:bg-neutral-950">
    <!-- Header -->
    <Header>
      <template #left>
        <SidebarToggle v-model:collapsed="sidebarCollapsed" />
        <h1 class="text-xl font-bold text-neutral-900 dark:text-neutral-100">
          Dashboard
        </h1>
      </template>
      <template #right>
        <template v-if="loggedIn">
          <Badge
            variant="success"
            pill
          >
            5 online
          </Badge>
          <Button
            dense
            ghost
          >
            Settings
          </Button>
          <Button
            dense
            primary
          >
            New Employee
          </Button>
          <UserMenu
            name="Alice Johnson"
            :items="userMenuItems"
            @select="onMenuSelect"
          />
        </template>
        <Button
          v-else
          dense
          primary
          @click="loggedIn = true"
        >
          Log in
        </Button>
      </template>
    </Header>

    <!-- Body: Sidebar + Main -->
    <div class="flex flex-1 overflow-hidden">
      <Sidebar v-model:collapsed="sidebarCollapsed">
        <Menu
          class="p-3"
          :items="menuItems"
          current-path="/"
        />
      </Sidebar>

      <main class="flex-1 overflow-y-auto p-8">
        <div class="mx-auto flex max-w-6xl flex-col gap-8">
          <!-- Alert -->
          <Alert
            variant="info"
            persistent
            dismissible
          >
            Welcome to the dashboard. This is a reference page showcasing Eunoia
            components.
          </Alert>

          <!-- Form Section -->
          <Card title="Add Employee">
            <div class="flex flex-col gap-4">
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Input
                  v-model="name"
                  type="text"
                  :maxlength="100"
                  helper="Legal full name"
                  :errors="nameErrors"
                  :invalid="nameErrors.length > 0"
                >
                  Full Name
                </Input>
                <Input
                  v-model="email"
                  type="text"
                  helper="We'll never share your email"
                  :errors="emailErrors"
                  :invalid="emailErrors.length > 0"
                >
                  Email
                </Input>
                <Input
                  v-model="website"
                  type="text"
                  helper="https://..."
                >
                  Website
                </Input>
              </div>
              <Select
                v-model="role"
                :options="roleOptions"
                multiple
              >
                Role
              </Select>
              <Input
                v-model="department"
                type="radio"
                value="engineer"
                :options="departmentOptions"
              >
                Department
                <template #description>
                  Engineers are responsible for designing and building software
                  systems.
                </template>
              </Input>
              <Input
                v-model="newsletter"
                type="checkbox"
              >
                Newsletter
                <template #description>
                  Subscribe to our
                  <Link href="https://example.com/newsletter">
                    monthly newsletter
                  </Link>
                </template>
              </Input>
            </div>

            <template #footer>
              <Button primary> Submit </Button>
              <Button>Cancel</Button>
              <Button ghost> Reset </Button>
              <Button destructive> Delete Draft </Button>
            </template>
          </Card>

          <!-- Dense Form -->
          <Card dense>
            <template #header>
              <h3
                class="text-base font-semibold text-neutral-900 dark:text-neutral-100"
              >
                Dense Variant
              </h3>
              <Badge
                variant="secondary"
                dense
              >
                Compact
              </Badge>
            </template>
            <div class="flex flex-col gap-4">
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Input
                  v-model="name"
                  type="text"
                  dense
                  :maxlength="100"
                  helper="Legal full name"
                >
                  Full Name
                </Input>
                <Input
                  v-model="email"
                  type="text"
                  dense
                  helper="We'll never share your email"
                  :errors="emailErrors"
                  :invalid="emailErrors.length > 0"
                >
                  Email
                </Input>
                <Input
                  v-model="website"
                  type="text"
                  dense
                  helper="https://..."
                >
                  Website
                </Input>
              </div>
              <Select
                v-model="role"
                :options="roleOptions"
                dense
                multiple
              >
                Role
              </Select>
              <Input
                v-model="department"
                type="radio"
                value="engineer"
                :options="departmentOptions"
                dense
              >
                Department

                <template #description>
                  Engineers are responsible for designing and building software
                  systems.
                </template>
              </Input>
              <Input
                v-model="newsletter"
                type="checkbox"
                dense
              >
                Newsletter
                <template #description>
                  Subscribe to our
                  <Link href="https://example.com/newsletter">
                    monthly newsletter
                  </Link>
                </template>
              </Input>
            </div>
            <template #footer>
              <Button
                primary
                dense
              >
                Submit
              </Button>
              <Button dense> Cancel </Button>
              <Button
                ghost
                dense
              >
                Reset
              </Button>
              <Button
                destructive
                dense
              >
                Delete Draft
              </Button>
            </template>
          </Card>

          <!-- Data Table -->
          <Card>
            <template #header>
              <h3 class="text-lg font-semibold text-neutral-900">Employees</h3>
              <div class="flex items-center gap-2">
                <Badge
                  variant="primary"
                  :count="5"
                >
                  Total
                </Badge>
                <Badge
                  variant="success"
                  :count="4"
                >
                  Active
                </Badge>
                <Badge
                  variant="warning"
                  :count="1"
                >
                  On Leave
                </Badge>
              </div>
            </template>
            <DataTable
              :columns
              :items="items"
            >
              <template #actions="{ item }">
                <div class="inline-flex items-center gap-1">
                  <Tooltip
                    content="View"
                    placement="top"
                  >
                    <Button
                      ghost
                      dense
                      @click="onView(item)"
                    >
                      <Icon
                        name="eye"
                        size="sm"
                      />
                    </Button>
                  </Tooltip>
                  <Tooltip
                    content="Edit"
                    placement="top"
                  >
                    <Button
                      ghost
                      dense
                      @click="onEdit(item)"
                    >
                      <Icon
                        name="pencil-simple"
                        size="sm"
                      />
                    </Button>
                  </Tooltip>
                  <Tooltip
                    content="Delete"
                    placement="top"
                  >
                    <Button
                      ghost
                      dense
                      destructive
                      @click="onDelete(item)"
                    >
                      <Icon
                        name="trash"
                        size="sm"
                      />
                    </Button>
                  </Tooltip>
                </div>
              </template>
            </DataTable>
          </Card>
        </div>
      </main>
    </div>
  </div>
</template>
