<template>
  <section
    :class="[
      'rounded-box border p-6 squircle',
      'border-neutral-200 bg-neutral-50',
      'dark:border-neutral-700 dark:bg-neutral-950',
      { dark },
    ]"
    :aria-label="dark ? 'Dark preview' : 'Light preview'"
  >
    <p
      class="mb-4 text-xs font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400"
    >
      {{ dark ? "Dark" : "Light" }}
    </p>

    <div class="grid gap-6 xl:grid-cols-2">
      <Card title="New project">
        <div class="flex flex-col gap-4">
          <Input v-model="name">Name</Input>
          <Select
            v-model="visibility"
            :options="visibilities"
          >
            Visibility
          </Select>
          <RadioGroup
            v-model="plan"
            :options="plans"
            aria-label="Plan"
          />
          <Switch v-model="notify">Notify the team</Switch>
          <Checkbox v-model="terms">
            <template #description>I accept the terms</template>
          </Checkbox>
        </div>
        <template #footer>
          <div class="flex flex-wrap gap-2">
            <Button primary>Create project</Button>
            <Button>Cancel</Button>
            <Button ghost>Save draft</Button>
          </div>
        </template>
      </Card>

      <div class="flex min-w-0 flex-col gap-4">
        <Tabs
          v-model="tab"
          :items="tabs"
          aria-label="Project sections"
          panel-class="pt-3"
        >
          <template #default="{ item }">
            <p class="text-sm text-neutral-600 dark:text-neutral-300">
              {{ item.label }} of the project, with
              <Link href="#">a link</Link> and <Kbd>⌘K</Kbd> to search.
            </p>
          </template>
        </Tabs>
        <div class="flex flex-wrap gap-2">
          <Badge variant="primary">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
        </div>
        <Progress
          :value="64"
          dense
        />
        <Alert
          v-for="alert in alerts"
          :key="alert.variant"
          :variant="alert.variant"
          dense
          persistent
        >
          {{ alert.text }}
        </Alert>
        <Button
          destructive
          class="self-start"
        >
          Delete project
        </Button>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  Input,
  Kbd,
  Link,
  Progress,
  RadioGroup,
  Select,
  Switch,
  Tabs,
  type TabItem,
} from "@/components";

defineProps<{
  dark?: boolean;
}>();

const name = ref("Parlance");
const visibility = ref("team");
const visibilities = [
  { label: "Only me", value: "private" },
  { label: "My team", value: "team" },
  { label: "Everyone", value: "public" },
];
const plan = ref("pro");
const plans = [
  { label: "Free", value: "free" },
  { label: "Pro", value: "pro" },
  { label: "Team", value: "team" },
];
const notify = ref(true);
const terms = ref(false);
const tab = ref("overview");
const tabs: TabItem[] = [
  { value: "overview", label: "Overview" },
  { value: "activity", label: "Activity" },
  { value: "settings", label: "Settings" },
];
const alerts = [
  { variant: "info", text: "A new version is available." },
  { variant: "success", text: "The project was saved." },
  { variant: "warning", text: "Your trial ends in 3 days." },
  { variant: "danger", text: "The upload failed." },
] as const;
</script>
