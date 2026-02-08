<template>
  <div class="min-h-screen bg-gray-50 font-sans">
    <!-- Header -->
    <header class="border-b border-gray-200 bg-white px-8 py-4">
      <div class="mx-auto flex max-w-6xl items-center justify-between">
        <h1 class="text-xl font-bold text-gray-900">Dashboard</h1>
        <div class="flex items-center gap-3">
          <Badge variant="success" pill>5 online</Badge>
          <Button dense ghost>Settings</Button>
          <Button dense primary>New Employee</Button>
        </div>
      </div>
    </header>

    <main class="mx-auto flex max-w-6xl flex-col gap-8 px-8 py-8">
      <!-- Alert -->
      <Alert variant="info" persistent dismissible>
        Welcome to the dashboard. This is a reference page showcasing Eunoia
        components.
      </Alert>

      <!-- Form Section -->
      <Card title="Add Employee">
        <div class="flex flex-col gap-4">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Input v-model="name" type="text">Full Name</Input>
            <Input v-model="email" type="text">Email</Input>
            <Input v-model="website" type="websitet">Website</Input>
          </div>
          <Select v-model="role" :options="roleOptions" multiple>Role</Select>
          <Input v-model="newsletter" type="checkbox">
            Subscribe to newsletter
          </Input>
        </div>

        <template #footer>
          <Button primary>Submit</Button>
          <Button>Cancel</Button>
          <Button ghost>Reset</Button>
          <Button destructive dense>Delete Draft</Button>
        </template>
      </Card>

      <!-- Dense Form -->
      <Card dense>
        <template #header>
          <h3 class="text-base font-semibold text-gray-900">Dense Variant</h3>
          <Badge variant="secondary" dense>Compact</Badge>
        </template>
        <div class="flex flex-col gap-4">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Input v-model="name" type="text" dense>Full Name</Input>
            <Input v-model="email" type="text" dense>Email</Input>
            <Input v-model="website" type="text" dense>Website</Input>
          </div>
          <Select v-model="role" :options="roleOptions" dense multiple>
            Role
          </Select>
          <Input v-model="newsletter" type="checkbox" dense>Newsletter</Input>
        </div>
        <template #footer>
          <Button primary dense>Submit</Button>
          <Button dense>Cancel</Button>
          <Button ghost dense>Reset</Button>
        </template>
      </Card>

      <!-- Data Table -->
      <Card>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900">Employees</h3>
          <div class="flex items-center gap-2">
            <Badge variant="primary" :count="5">Total</Badge>
            <Badge variant="success" :count="4">Active</Badge>
            <Badge variant="warning" :count="1">On Leave</Badge>
          </div>
        </template>
        <DataTable :headers="headers" :items="items">
          <template #actions="{ item }">
            <div class="inline-flex items-center gap-1">
              <Tooltip content="View" placement="top">
                <Button ghost dense @click="onView(item)"
                  ><Icon name="eye" size="sm"
                /></Button>
              </Tooltip>
              <Tooltip content="Edit" placement="top">
                <Button ghost dense @click="onEdit(item)"
                  ><Icon name="pencil-simple" size="sm"
                /></Button>
              </Tooltip>
              <Tooltip content="Delete" placement="top">
                <Button ghost dense destructive @click="onDelete(item)"
                  ><Icon name="trash" size="sm"
                /></Button>
              </Tooltip>
            </div>
          </template>
        </DataTable>
      </Card>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import Button from "@/components/core/Button/Button.vue";
import Input from "@/components/form/Input/Input.vue";
import Select from "@/components/form/Select/Select.vue";
import Badge from "@/components/core/Badge/Badge.vue";
import Alert from "@/components/feedback/Alert/Alert.vue";
import Card from "@/components/display/Card/Card.vue";
import DataTable from "@/components/display/DataTable/DataTable.vue";
import Icon from "@/components/core/Icon/Icon.vue";
import Tooltip from "@/components/feedback/Tooltip/Tooltip.vue";

const name = ref("");
const email = ref("");
const website = ref("");
const role = ref<string>("");
const newsletter = ref(false);

const emit = defineEmits<{
  (e: "view", item: Record<string, unknown>): void;
  (e: "edit", item: Record<string, unknown>): void;
  (e: "delete", item: Record<string, unknown>): void;
}>();

const onView = (item: Record<string, unknown>) => emit("view", item);
const onEdit = (item: Record<string, unknown>) => emit("edit", item);
const onDelete = (item: Record<string, unknown>) => emit("delete", item);

const roleOptions = [
  { label: "Engineer", value: "engineer" },
  { label: "Designer", value: "designer" },
  { label: "Manager", value: "manager" },
  { label: "QA", value: "qa" },
];

const headers = [
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
