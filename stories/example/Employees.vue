<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import {
  ActionMenu,
  Avatar,
  Badge,
  Button,
  Card,
  ConfirmDialog,
  DataTable,
  EmptyState,
  Input,
  Pagination,
  Select,
  Text,
  ToastStack,
} from "@/components";
import type { ActionMenuItem } from "@/components";
import type { HeaderAction } from "@/types";
import AppShell from "./AppShell.vue";

type Status = "Active" | "On leave" | "Onboarding";

type Employee = {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: Status;
  /** ISO date, so it sorts as text. */
  startDate: string;
};

const emit = defineEmits<{
  (e: "navigate", path: string): void;
  (e: "add"): void;
  (e: "import"): void;
  (e: "export"): void;
  (e: "showArchived"): void;
  (e: "view", employee: Employee): void;
  (e: "edit", employee: Employee): void;
}>();

const employees = ref<Employee[]>([
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    role: "Senior Engineer",
    department: "Engineering",
    status: "Active",
    startDate: "2019-03-11",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob.smith@example.com",
    role: "Product Designer",
    department: "Design",
    status: "Active",
    startDate: "2021-07-05",
  },
  {
    id: 3,
    name: "Carol White",
    email: "carol.white@example.com",
    role: "Engineering Manager",
    department: "Engineering",
    status: "On leave",
    startDate: "2017-01-16",
  },
  {
    id: 4,
    name: "David Lee",
    email: "david.lee@example.com",
    role: "Frontend Engineer",
    department: "Engineering",
    status: "Active",
    startDate: "2022-02-28",
  },
  {
    id: 5,
    name: "Eva Martinez",
    email: "eva.martinez@example.com",
    role: "QA Engineer",
    department: "Engineering",
    status: "Onboarding",
    startDate: "2025-09-01",
  },
  {
    id: 6,
    name: "Farid Haddad",
    email: "farid.haddad@example.com",
    role: "Product Manager",
    department: "Product",
    status: "Active",
    startDate: "2020-10-12",
  },
  {
    id: 7,
    name: "Grace Kim",
    email: "grace.kim@example.com",
    role: "Content Strategist",
    department: "Marketing",
    status: "Active",
    startDate: "2023-04-03",
  },
  {
    id: 8,
    name: "Hiro Tanaka",
    email: "hiro.tanaka@example.com",
    role: "Account Executive",
    department: "Sales",
    status: "On leave",
    startDate: "2018-06-25",
  },
  {
    id: 9,
    name: "Ines Moreau",
    email: "ines.moreau@example.com",
    role: "People Partner",
    department: "People",
    status: "Active",
    startDate: "2021-11-08",
  },
  {
    id: 10,
    name: "Jonas Berg",
    email: "jonas.berg@example.com",
    role: "Brand Designer",
    department: "Design",
    status: "Onboarding",
    startDate: "2025-10-06",
  },
  {
    id: 11,
    name: "Kemi Adeyemi",
    email: "kemi.adeyemi@example.com",
    role: "Growth Marketer",
    department: "Marketing",
    status: "Active",
    startDate: "2022-08-15",
  },
  {
    id: 12,
    name: "Liam O'Brien",
    email: "liam.obrien@example.com",
    role: "Sales Lead",
    department: "Sales",
    status: "Active",
    startDate: "2016-05-02",
  },
]);

const departments = computed(() =>
  [...new Set(employees.value.map((employee) => employee.department))].sort()
);

const description = computed(
  () =>
    `${employees.value.length} people across ${departments.value.length} departments`
);

const headerActions: HeaderAction[] = [
  { content: "Import", icon: "upload", onClick: () => emit("import") },
  { content: "Export", icon: "download", onClick: () => emit("export") },
];
const addEmployee: HeaderAction = {
  content: "Add employee",
  icon: "user-plus",
  onClick: () => emit("add"),
};
const moreActions: HeaderAction[] = [
  {
    content: "Archived employees",
    icon: "archive",
    onClick: () => emit("showArchived"),
  },
];

// Filters

const search = ref("");
const department = ref<string | number>("");
const status = ref<string | number>("");

const departmentOptions = computed(() => [
  { label: "All departments", value: "" },
  ...departments.value.map((name) => ({ label: name, value: name })),
]);

const statusOptions = [
  { label: "Any status", value: "" },
  { label: "Active", value: "Active" },
  { label: "On leave", value: "On leave" },
  { label: "Onboarding", value: "Onboarding" },
];

const hasFilters = computed(
  () => !!search.value.trim() || !!department.value || !!status.value
);

function clearFilters() {
  search.value = "";
  department.value = "";
  status.value = "";
}

const filtered = computed(() => {
  const query = search.value.trim().toLowerCase();

  return employees.value.filter(
    (employee) =>
      (!query ||
        [employee.name, employee.email, employee.role].some((text) =>
          text.toLowerCase().includes(query)
        )) &&
      (!department.value || employee.department === department.value) &&
      (!status.value || employee.status === status.value)
  );
});

// Sorting happens here rather than in the table's headers: the table only
// sees one page at a time, so it could only sort within that page.

const sort = ref<string | number>("name-asc");

const sortOptions = [
  { label: "Name, A to Z", value: "name-asc" },
  { label: "Name, Z to A", value: "name-desc" },
  { label: "Newest first", value: "start-desc" },
  { label: "Longest tenure", value: "start-asc" },
];

const sorted = computed(() => {
  const [key, direction] = String(sort.value).split("-");
  const field = key === "start" ? "startDate" : "name";
  const factor = direction === "desc" ? -1 : 1;

  return [...filtered.value].sort(
    (a, b) => a[field].localeCompare(b[field]) * factor
  );
});

// Pagination

const page = ref(1);
const perPage = ref(5);
const perPageOptions = [
  { label: "5 per page", value: 5 },
  { label: "10 per page", value: 10 },
  { label: "25 per page", value: 25 },
];

const pageCount = computed(() =>
  Math.max(1, Math.ceil(sorted.value.length / perPage.value))
);

const pageItems = computed(() =>
  sorted.value.slice(
    (page.value - 1) * perPage.value,
    page.value * perPage.value
  )
);

// New filters start from the first page; removing the last row of a page
// steps back one.
watch([search, department, status, sort, perPage], () => (page.value = 1));
watch(pageCount, (count) => (page.value = Math.min(page.value, count)));

const summary = computed(() => {
  const total = sorted.value.length;
  if (!total) return "No matching employees";

  const first = (page.value - 1) * perPage.value + 1;
  const last = Math.min(page.value * perPage.value, total);
  const noun = hasFilters.value ? "matching employees" : "employees";

  return `${first}–${last} of ${total} ${noun}`;
});

// Table

const dateFormat = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

const columns = [
  { title: "Name", key: "name" },
  { title: "Role", key: "role" },
  { title: "Department", key: "department" },
  { title: "Status", key: "status" },
  {
    title: "Started",
    key: "startDate",
    value: (employee: Employee) =>
      dateFormat.format(new Date(employee.startDate)),
  },
];

const statusVariants: Record<Status, "success" | "warning" | "primary"> = {
  Active: "success",
  "On leave": "warning",
  Onboarding: "primary",
};

const rowActions: ActionMenuItem[] = [
  { value: "view", label: "View profile", icon: "user" },
  { value: "edit", label: "Edit", icon: "pencil-simple" },
  {
    value: "remove",
    label: "Remove",
    icon: "trash",
    variant: "danger",
    divider: true,
  },
];

function onRowAction(action: string, employee: Employee) {
  if (action === "view") emit("view", employee);
  if (action === "edit") emit("edit", employee);
  if (action === "remove") askToRemove(employee);
}

// Removing

const toasts = ref<InstanceType<typeof ToastStack> | null>(null);
const removing = ref<Employee>();
const confirmOpen = ref(false);

function askToRemove(employee: Employee) {
  removing.value = employee;
  confirmOpen.value = true;
}

function remove() {
  const employee = removing.value;
  confirmOpen.value = false;
  if (!employee) return;

  employees.value = employees.value.filter(({ id }) => id !== employee.id);
  toasts.value?.add({
    message: `${employee.name} was removed.`,
    variant: "success",
  });
}
</script>

<template>
  <AppShell
    title="Employees"
    :description
    current-path="/employees"
    :actions="headerActions"
    :primary-action="addEmployee"
    :secondary-actions="moreActions"
    @navigate="emit('navigate', $event)"
  >
    <div class="flex flex-col gap-6">
      <div
        role="search"
        aria-label="Filter employees"
        class="flex flex-wrap items-center gap-3"
      >
        <div class="w-full md:w-auto md:min-w-64 md:flex-1">
          <Input
            v-model="search"
            type="search"
            aria-label="Search employees"
            placeholder="Search by name, email or role"
          />
        </div>
        <div class="min-w-36 flex-1 md:w-48 md:flex-none">
          <Select
            v-model="department"
            :options="departmentOptions"
            aria-label="Department"
          />
        </div>
        <div class="min-w-36 flex-1 md:w-40 md:flex-none">
          <Select
            v-model="status"
            :options="statusOptions"
            aria-label="Status"
          />
        </div>
        <Button
          v-if="hasFilters"
          ghost
          icon="x"
          @click="clearFilters"
        >
          Clear filters
        </Button>
      </div>

      <Card>
        <template #header>
          <div class="flex w-full flex-wrap items-center justify-between gap-3">
            <Text
              size="sm"
              muted
              aria-live="polite"
            >
              {{ summary }}
            </Text>
            <div class="w-full sm:w-48">
              <Select
                v-model="sort"
                :options="sortOptions"
                aria-label="Sort by"
              />
            </div>
          </div>
        </template>

        <DataTable
          :columns
          :items="pageItems"
          aria-label="Employees"
        >
          <template #name="{ item }">
            <div class="flex min-w-0 items-center gap-3">
              <Avatar
                :name="item.name"
                size="sm"
              />
              <div class="min-w-0">
                <div
                  class="truncate font-medium text-neutral-900 dark:text-neutral-100"
                >
                  {{ item.name }}
                </div>
                <div
                  class="truncate text-sm font-normal text-neutral-500 dark:text-neutral-400"
                >
                  {{ item.email }}
                </div>
              </div>
            </div>
          </template>

          <template #status="{ item }">
            <Badge
              :variant="statusVariants[item.status]"
              dense
              pill
            >
              {{ item.status }}
            </Badge>
          </template>

          <template #actions="{ item }">
            <ActionMenu
              :items="rowActions"
              :label="`Actions for ${item.name}`"
              @select="onRowAction($event, item)"
            />
          </template>

          <template #empty>
            <EmptyState
              icon="magnifying-glass"
              title="No employees match"
              description="Try another search, or clear the filters to see everyone."
            >
              <Button @click="clearFilters">Clear filters</Button>
            </EmptyState>
          </template>
        </DataTable>

        <Pagination
          v-if="sorted.length"
          v-model:current="page"
          v-model:per-page="perPage"
          :total="pageCount"
          :per-page-options
          class="mt-4"
        />
      </Card>
    </div>

    <ConfirmDialog
      :open="confirmOpen"
      :title="`Remove ${removing?.name ?? 'employee'}?`"
      :locale="{ confirm: 'Remove' }"
      @confirm="remove"
      @close="confirmOpen = false"
    >
      <Text>
        {{ removing?.name }} loses access to the workspace right away. Their
        projects stay where they are, and you can invite them again later.
      </Text>
    </ConfirmDialog>

    <ToastStack
      ref="toasts"
      position="top-right"
    />
  </AppShell>
</template>
