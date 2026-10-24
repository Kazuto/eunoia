<script lang="ts" setup>
import { computed, ref, useTemplateRef, watch } from "vue";
import {
  ActionMenu,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Chip,
  ConfirmDialog,
  DescriptionItem,
  DescriptionList,
  Dropzone,
  Grid,
  Icon,
  Link,
  List,
  ListItem,
  Stack,
  Tabs,
  Text,
  Timeline,
  ToastStack,
} from "@/components";
import type {
  ActionMenuItem,
  BreadcrumbItem,
  TabItem,
  TimelineItem,
} from "@/components";
import type { HeaderAction } from "@/types";
import AppShell from "./AppShell.vue";

const emit = defineEmits<{
  (e: "navigate", path: string): void;
  (e: "message"): void;
  (e: "edit"): void;
}>();

const email = "alice.johnson@example.com";
const active = ref(true);
const confirmingDeactivation = ref(false);
const toasts = useTemplateRef<InstanceType<typeof ToastStack>>("toasts");

const breadcrumbs: BreadcrumbItem[] = [
  { label: "Employees", href: "/employees" },
  { label: "Alice Johnson" },
];

const backAction: HeaderAction = {
  content: "Back to employees",
  onClick: () => emit("navigate", "/employees"),
};

const copyAction: HeaderAction = {
  content: "Copy email address",
  onClick: async () => {
    try {
      await navigator.clipboard.writeText(email);
      toasts.value?.add({
        message: "Email address copied",
        variant: "success",
      });
    } catch {
      toasts.value?.add({
        message: "Couldn't copy the email address",
        variant: "warning",
      });
    }
  },
};

const actions: HeaderAction[] = [
  { content: "Message", icon: "chat-circle", onClick: () => emit("message") },
  { content: "Edit", icon: "pencil-simple", onClick: () => emit("edit") },
];

const secondaryActions = computed<HeaderAction[]>(() => [
  { content: "Download profile", icon: "download-simple" },
  active.value
    ? {
        content: "Deactivate",
        icon: "user-minus",
        onClick: () => (confirmingDeactivation.value = true),
      }
    : { content: "Reactivate", icon: "user-plus", onClick: reactivate },
]);

const hoursAgo = (hours: number) => new Date(Date.now() - hours * 3_600_000);

const activity = ref<TimelineItem[]>([
  {
    title: "Completed the quarterly review",
    description: "Rated “Exceeds expectations” by Carol White.",
    time: hoursAgo(2),
    icon: "check-circle",
    variant: "success",
  },
  {
    title: "Joined the Design Systems project",
    time: hoursAgo(26),
    icon: "folder",
  },
  {
    title: "Time off approved",
    description: "March 18 – March 22",
    time: hoursAgo(24 * 9),
    icon: "airplane-tilt",
    variant: "warning",
  },
  {
    title: "Promoted to Senior Engineer",
    time: "January 2024",
    icon: "trophy",
    variant: "success",
  },
  { title: "Joined the company", time: "March 2021", variant: "secondary" },
]);

function deactivate() {
  confirmingDeactivation.value = false;
  active.value = false;
  activity.value.unshift({
    title: "Account deactivated",
    time: new Date(),
    icon: "user-minus",
    variant: "danger",
  });
  toasts.value?.add({ message: "Alice Johnson was deactivated" });
}

function reactivate() {
  active.value = true;
  activity.value.unshift({
    title: "Account reactivated",
    time: new Date(),
    icon: "user-plus",
    variant: "success",
  });
  toasts.value?.add({
    message: "Alice Johnson was reactivated",
    variant: "success",
  });
}

const skills = [
  "TypeScript",
  "Vue",
  "Accessibility",
  "Design systems",
  "Testing",
  "Mentoring",
];

type EmployeeDocument = {
  id: number;
  name: string;
  type: string;
  size: number;
  added: string;
};

let nextDocumentId = 1;
const documents = ref<EmployeeDocument[]>([
  {
    id: nextDocumentId++,
    name: "Employment contract.pdf",
    type: "application/pdf",
    size: 248_000,
    added: "Mar 1, 2021",
  },
  {
    id: nextDocumentId++,
    name: "Promotion letter.pdf",
    type: "application/pdf",
    size: 96_000,
    added: "Jan 8, 2024",
  },
  {
    id: nextDocumentId++,
    name: "Headshot.jpg",
    type: "image/jpeg",
    size: 1_420_000,
    added: "Jan 9, 2024",
  },
]);

const tabs: TabItem[] = [
  { value: "overview", label: "Overview" },
  { value: "activity", label: "Activity" },
  { value: "documents", label: "Documents" },
];
const tab = ref("overview");

function fileIcon(type: string) {
  if (type === "application/pdf") return "file-pdf";
  if (type.startsWith("image/")) return "file-image";
  return "file-text";
}

function fileSize(bytes: number) {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1_000))} KB`;
}

function addDocuments(files: Iterable<File>) {
  const added = [...files].map((file) => ({
    id: nextDocumentId++,
    name: file.name,
    type: file.type,
    size: file.size,
    added: "Just now",
  }));
  if (!added.length) return;

  documents.value.unshift(...added);
  toasts.value?.add({
    message:
      added.length === 1
        ? `${added[0]!.name} was added`
        : `${added.length} documents were added`,
    variant: "success",
  });
}

// The dropzone holds one file at a time; hand it to the list and clear it,
// so the next file can be dropped right away.
const dropped = ref<File>();
watch(dropped, (file) => {
  if (!file) return;
  addDocuments([file]);
  dropped.value = undefined;
});

// The dropzone can't be reached by keyboard, so a button opens the file
// picker as well.
const filePicker = useTemplateRef<HTMLInputElement>("filePicker");
function pickFiles(event: Event) {
  const input = event.target as HTMLInputElement;
  addDocuments(input.files ?? []);
  input.value = "";
}

const documentActions: ActionMenuItem[] = [
  { value: "download", label: "Download", icon: "download-simple" },
  {
    value: "delete",
    label: "Delete",
    icon: "trash",
    variant: "danger",
    divider: true,
  },
];

function onDocumentAction(document: EmployeeDocument, action: string) {
  if (action === "download") {
    toasts.value?.add({ message: `Downloading ${document.name}…` });
    return;
  }

  documents.value = documents.value.filter((item) => item.id !== document.id);
  toasts.value?.add({ message: `${document.name} was deleted` });
}
</script>

<template>
  <AppShell
    title="Alice Johnson"
    description="Senior Engineer · Platform"
    current-path="/employees/alice-johnson"
    :back-action
    :copy-action
    :actions
    :secondary-actions
    @navigate="emit('navigate', $event)"
  >
    <Stack :gap="6">
      <Breadcrumb :items="breadcrumbs" />

      <Grid
        :cols="1"
        :gap="6"
        class="items-start lg:grid-cols-[18rem_minmax(0,1fr)]"
      >
        <Stack
          as="aside"
          :gap="6"
          aria-label="Summary"
        >
          <Card>
            <Stack
              align="center"
              :gap="3"
              class="text-center"
            >
              <Avatar
                name="Alice Johnson"
                size="xl"
              />
              <div>
                <Text weight="semibold">Alice Johnson</Text>
                <Text
                  size="sm"
                  muted
                >
                  Senior Engineer
                </Text>
              </div>
              <Badge
                :variant="active ? 'success' : 'secondary'"
                pill
                dense
              >
                {{ active ? "Active" : "Inactive" }}
              </Badge>
            </Stack>

            <ul
              class="mt-6 flex flex-col gap-3 border-t border-neutral-200 pt-6 text-sm text-neutral-700 dark:border-neutral-700 dark:text-neutral-300"
            >
              <li class="flex min-w-0 items-center gap-3">
                <Icon
                  name="envelope-simple"
                  size="sm"
                  class="text-neutral-500 dark:text-neutral-400"
                />
                <Link
                  :href="`mailto:${email}`"
                  class="truncate"
                >
                  {{ email }}
                </Link>
              </li>
              <li class="flex items-center gap-3">
                <Icon
                  name="phone"
                  size="sm"
                  class="text-neutral-500 dark:text-neutral-400"
                />
                +1 555 0142
              </li>
              <li class="flex items-center gap-3">
                <Icon
                  name="map-pin"
                  size="sm"
                  class="text-neutral-500 dark:text-neutral-400"
                />
                Lisbon, Portugal
              </li>
              <li class="flex items-center gap-3">
                <Icon
                  name="briefcase"
                  size="sm"
                  class="text-neutral-500 dark:text-neutral-400"
                />
                Full-time · Hybrid
              </li>
            </ul>
          </Card>

          <Card title="Reports to">
            <div class="flex items-center gap-3">
              <Avatar
                name="Carol White"
                size="sm"
              />
              <div class="min-w-0">
                <Link
                  href="/employees/carol-white"
                  class="text-sm font-medium"
                >
                  Carol White
                </Link>
                <Text
                  size="sm"
                  muted
                >
                  Engineering Manager
                </Text>
              </div>
            </div>
          </Card>
        </Stack>

        <Tabs
          v-model="tab"
          :items="tabs"
          aria-label="Employee details"
          panel-class="pt-6"
        >
          <template #default="{ item }">
            <Stack
              v-if="item.value === 'overview'"
              :gap="6"
            >
              <Card title="About">
                <Text
                  size="sm"
                  class="text-neutral-700 dark:text-neutral-300"
                >
                  Alice leads the platform team's work on the shared component
                  library and the build pipeline, and is the first point of
                  contact for accessibility questions.
                </Text>
              </Card>

              <Card title="Details">
                <DescriptionList>
                  <DescriptionItem term="Employee ID">E-1042</DescriptionItem>
                  <DescriptionItem term="Department">Platform</DescriptionItem>
                  <DescriptionItem term="Team">
                    Web infrastructure
                  </DescriptionItem>
                  <DescriptionItem term="Manager">Carol White</DescriptionItem>
                  <DescriptionItem term="Start date">
                    March 1, 2021
                  </DescriptionItem>
                  <DescriptionItem term="Work email">
                    <Link :href="`mailto:${email}`">{{ email }}</Link>
                  </DescriptionItem>
                  <DescriptionItem term="Time zone">
                    Western European Time (UTC+0)
                  </DescriptionItem>
                </DescriptionList>
              </Card>

              <Card title="Skills">
                <div class="flex flex-wrap gap-2">
                  <Chip
                    v-for="skill in skills"
                    :key="skill"
                    variant="secondary"
                  >
                    {{ skill }}
                  </Chip>
                </div>
              </Card>
            </Stack>

            <Card
              v-else-if="item.value === 'activity'"
              title="Recent activity"
            >
              <Timeline :items="activity" />
            </Card>

            <Card v-else>
              <template #header>
                <h2
                  class="text-base font-semibold text-neutral-900 dark:text-neutral-100"
                >
                  Documents
                  <span
                    class="font-normal text-neutral-500 dark:text-neutral-400"
                  >
                    · {{ documents.length }}
                  </span>
                </h2>
                <Button
                  dense
                  icon="upload-simple"
                  @click="filePicker?.click()"
                >
                  Upload
                </Button>
                <input
                  ref="filePicker"
                  type="file"
                  multiple
                  class="hidden"
                  @change="pickFiles"
                />
              </template>

              <Stack :gap="4">
                <List
                  v-if="documents.length"
                  variant="divided"
                >
                  <ListItem
                    v-for="document in documents"
                    :key="document.id"
                  >
                    <template #leading>
                      <Icon :name="fileIcon(document.type)" />
                    </template>
                    <span class="block truncate">{{ document.name }}</span>
                    <template #description>
                      {{ fileSize(document.size) }} · {{ document.added }}
                    </template>
                    <template #trailing>
                      <ActionMenu
                        :items="documentActions"
                        :label="`Actions for ${document.name}`"
                        dense
                        @select="onDocumentAction(document, $event)"
                      />
                    </template>
                  </ListItem>
                </List>
                <Text
                  v-else
                  size="sm"
                  muted
                >
                  No documents yet.
                </Text>

                <Dropzone v-model="dropped" />
              </Stack>
            </Card>
          </template>
        </Tabs>
      </Grid>
    </Stack>

    <ConfirmDialog
      title="Deactivate Alice Johnson?"
      :open="confirmingDeactivation"
      :locale="{ confirm: 'Deactivate' }"
      @confirm="deactivate"
      @cancel="confirmingDeactivation = false"
    >
      <Text size="sm">
        Alice will lose access to all apps right away. Documents and history
        stay, and you can reactivate the account at any time.
      </Text>
    </ConfirmDialog>

    <ToastStack
      ref="toasts"
      position="top-center"
    />
  </AppShell>
</template>
