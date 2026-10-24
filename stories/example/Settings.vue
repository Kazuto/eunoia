<script lang="ts" setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  reactive,
  ref,
  useTemplateRef,
  watch,
} from "vue";
import {
  Avatar,
  Button,
  Card,
  ColorPicker,
  ConfirmDialog,
  FormGroup,
  Input,
  RadioGroup,
  Select,
  Switch,
  Tabs,
  Text,
  Textarea,
  ToastStack,
} from "@/components";
import type { TabItem } from "@/components";
import AppShell from "./AppShell.vue";

type Section = "profile" | "notifications" | "appearance";

const emit = defineEmits<{
  (e: "navigate", path: string): void;
  (e: "save", section: Section, values: Record<string, unknown>): void;
  (e: "deleteAccount"): void;
}>();

const tabs: TabItem[] = [
  { value: "profile", label: "Profile" },
  { value: "notifications", label: "Notifications" },
  { value: "appearance", label: "Appearance" },
];
const tab = ref<Section>("profile");

const toasts = useTemplateRef<InstanceType<typeof ToastStack>>("toasts");

// Profile

const languages = [
  { label: "English", value: "en" },
  { label: "Deutsch", value: "de" },
  { label: "Español", value: "es" },
  { label: "Français", value: "fr" },
  { label: "日本語", value: "ja" },
];

const timeZones = [
  { label: "Pacific Time (UTC−8)", value: "America/Los_Angeles" },
  { label: "Eastern Time (UTC−5)", value: "America/New_York" },
  { label: "London (UTC+0)", value: "Europe/London" },
  { label: "Berlin (UTC+1)", value: "Europe/Berlin" },
  { label: "Tokyo (UTC+9)", value: "Asia/Tokyo" },
];

const savedProfile = ref({
  name: "Alice Johnson",
  email: "alice@example.com",
  bio: "Engineer on the platform team. Ask me about build pipelines.",
  language: "en",
  timeZone: "Europe/Berlin",
});
const profile = reactive({ ...savedProfile.value });

const dirty = computed(
  () => JSON.stringify(profile) !== JSON.stringify(savedProfile.value)
);

// Errors show once Save was pressed, then follow along as the fields change.
const submitted = ref(false);
const errors = computed(() => ({
  name: submitted.value && !profile.name.trim() ? ["Enter your name."] : [],
  email:
    submitted.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)
      ? ["Enter an email address like name@example.com."]
      : [],
}));

async function saveProfile() {
  submitted.value = true;
  const invalid = Object.entries(errors.value).find(
    ([, messages]) => messages.length
  );
  if (invalid) {
    await nextTick();
    document.getElementById(`settings-${invalid[0]}`)?.focus();
    return;
  }

  savedProfile.value = { ...profile };
  submitted.value = false;
  emit("save", "profile", { ...profile });
  toasts.value?.add({ message: "Profile saved", variant: "success" });
}

function resetProfile() {
  Object.assign(profile, savedProfile.value);
  submitted.value = false;
}

const photo = ref<string>();
const photoInput = useTemplateRef<HTMLInputElement>("photoInput");

function choosePhoto(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  removePhoto();
  photo.value = URL.createObjectURL(file);
  input.value = "";
}

function removePhoto() {
  if (photo.value) URL.revokeObjectURL(photo.value);
  photo.value = undefined;
}

onBeforeUnmount(removePhoto);

const confirmingDelete = ref(false);

function deleteAccount() {
  confirmingDelete.value = false;
  emit("deleteAccount");
}

// Notifications, saved as they change

const notifications = reactive({
  productUpdates: true,
  digest: true,
  frequency: "weekly",
  mentions: true,
  reminders: false,
});

type NotificationSwitch = {
  key: "productUpdates" | "digest" | "mentions" | "reminders";
  label: string;
  description: string;
};

const emailSwitches: NotificationSwitch[] = [
  {
    key: "productUpdates",
    label: "Product updates",
    description: "News about new features and improvements.",
  },
  {
    key: "digest",
    label: "Activity digest",
    description: "A summary of what happened while you were away.",
  },
];

const pushSwitches: NotificationSwitch[] = [
  {
    key: "mentions",
    label: "Mentions",
    description: "When someone mentions you or replies to you.",
  },
  {
    key: "reminders",
    label: "Reminders",
    description: "Due dates and events you've been invited to.",
  },
];

const frequencies = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
];

watch(notifications, (values) => emit("save", "notifications", { ...values }));

// Appearance, saved as it changes. In an app, pass the theme on to
// `useTheme().setTheme`; here Storybook's toolbar decides the theme.

const appearance = reactive({
  theme: "system",
  density: "comfortable",
  accent: "#8b5cf6",
});

const themes = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "System", value: "system" },
];

const densities = [
  { label: "Comfortable", value: "comfortable" },
  { label: "Compact", value: "compact" },
];

const accents = [
  "#8b5cf6",
  "#3b82f6",
  "#14b8a6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
];

watch(appearance, (values) => emit("save", "appearance", { ...values }));
</script>

<template>
  <AppShell
    title="Settings"
    description="Your profile, notifications, and how the app looks"
    current-path="/settings"
    width="narrow"
    @navigate="emit('navigate', $event)"
  >
    <Tabs
      v-model="tab"
      :items="tabs"
      aria-label="Settings"
      panel-class="pt-6"
    >
      <template #default="{ item }">
        <div
          v-if="item.value === 'profile'"
          class="flex flex-col gap-6"
        >
          <Card title="Profile">
            <div class="flex flex-col gap-6">
              <div class="flex flex-wrap items-center gap-4">
                <Avatar
                  :src="photo"
                  :name="profile.name || savedProfile.name"
                  size="xl"
                />
                <div class="flex flex-col gap-2">
                  <div class="flex flex-wrap gap-2">
                    <Button
                      dense
                      icon="upload-simple"
                      @click="photoInput?.click()"
                    >
                      Change photo
                    </Button>
                    <Button
                      dense
                      ghost
                      :disabled="!photo"
                      @click="removePhoto"
                    >
                      Remove
                    </Button>
                  </div>
                  <Text
                    muted
                    size="sm"
                  >
                    A square image works best, at least 256 × 256 pixels.
                  </Text>
                </div>
                <input
                  ref="photoInput"
                  type="file"
                  accept="image/*"
                  class="sr-only"
                  tabindex="-1"
                  aria-hidden="true"
                  @change="choosePhoto"
                />
              </div>

              <div class="grid gap-4 sm:grid-cols-2">
                <Input
                  id="settings-name"
                  v-model="profile.name"
                  autocomplete="name"
                  :errors="errors.name"
                  :invalid="errors.name.length > 0"
                >
                  Full name
                </Input>
                <Input
                  id="settings-email"
                  v-model="profile.email"
                  type="email"
                  autocomplete="email"
                  :errors="errors.email"
                  :invalid="errors.email.length > 0"
                >
                  Email
                </Input>
              </div>

              <Textarea
                v-model="profile.bio"
                maxlength="160"
                helper="Shown on your profile, next to your name."
                rows="3"
              >
                Bio
              </Textarea>

              <div class="grid gap-4 sm:grid-cols-2">
                <Select
                  v-model="profile.language"
                  :options="languages"
                  teleport-to="body"
                >
                  Language
                </Select>
                <Select
                  v-model="profile.timeZone"
                  :options="timeZones"
                  teleport-to="body"
                >
                  Time zone
                </Select>
              </div>
            </div>

            <template #footer>
              <Button
                primary
                @click="saveProfile"
              >
                Save
              </Button>
              <Button
                :disabled="!dirty"
                @click="resetProfile"
              >
                Cancel
              </Button>
            </template>
          </Card>

          <Card
            title="Danger zone"
            class="shadow-[inset_0_0_0_1px_rgba(239,68,68,0.45)] dark:shadow-[inset_0_0_0_1px_rgba(248,113,113,0.4)]"
          >
            <div
              class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div class="flex flex-col gap-1">
                <Text weight="medium">Delete account</Text>
                <Text
                  muted
                  size="sm"
                >
                  Removes your profile and everything you've created. This can't
                  be undone.
                </Text>
              </div>
              <Button
                destructive
                class="shrink-0 self-start sm:self-auto"
                @click="confirmingDelete = true"
              >
                Delete account
              </Button>
            </div>
          </Card>
        </div>

        <Card
          v-else-if="item.value === 'notifications'"
          title="Notifications"
        >
          <div class="flex flex-col gap-8">
            <FormGroup aria-label="Email">
              <template #label>Email</template>
              <div class="mt-2 flex flex-col gap-4">
                <template
                  v-for="option in emailSwitches"
                  :key="option.key"
                >
                  <div class="flex flex-col gap-1">
                    <Switch
                      v-model="notifications[option.key]"
                      :aria-describedby="`notify-${option.key}`"
                    >
                      {{ option.label }}
                    </Switch>
                    <Text
                      :id="`notify-${option.key}`"
                      muted
                      size="sm"
                      class="pl-14"
                    >
                      {{ option.description }}
                    </Text>
                  </div>
                </template>
                <div class="flex flex-col gap-2 pl-14">
                  <Text
                    id="digest-frequency"
                    as="span"
                    size="sm"
                    weight="medium"
                    :class="{ 'opacity-50': !notifications.digest }"
                  >
                    Digest frequency
                  </Text>
                  <RadioGroup
                    v-model="notifications.frequency"
                    :options="frequencies"
                    :disabled="!notifications.digest"
                    aria-labelledby="digest-frequency"
                    dense
                    class="sm:max-w-sm"
                  />
                </div>
              </div>
            </FormGroup>

            <FormGroup aria-label="Push">
              <template #label>Push</template>
              <div class="mt-2 flex flex-col gap-4">
                <div
                  v-for="option in pushSwitches"
                  :key="option.key"
                  class="flex flex-col gap-1"
                >
                  <Switch
                    v-model="notifications[option.key]"
                    :aria-describedby="`notify-${option.key}`"
                  >
                    {{ option.label }}
                  </Switch>
                  <Text
                    :id="`notify-${option.key}`"
                    muted
                    size="sm"
                    class="pl-14"
                  >
                    {{ option.description }}
                  </Text>
                </div>
              </div>
            </FormGroup>

            <Text
              muted
              size="sm"
            >
              Changes are saved as you make them.
            </Text>
          </div>
        </Card>

        <Card
          v-else
          title="Appearance"
        >
          <div class="flex flex-col gap-6">
            <FormGroup
              aria-label="Theme"
              helper="System follows the setting of your device."
            >
              <template #label>Theme</template>
              <RadioGroup
                v-model="appearance.theme"
                :options="themes"
                aria-label="Theme"
                class="sm:max-w-sm"
              />
            </FormGroup>

            <FormGroup
              aria-label="Density"
              helper="Compact fits more onto the screen, e.g. in long tables."
            >
              <template #label>Density</template>
              <RadioGroup
                v-model="appearance.density"
                :options="densities"
                aria-label="Density"
                class="sm:max-w-sm"
              />
            </FormGroup>

            <div class="sm:max-w-sm">
              <ColorPicker
                v-model="appearance.accent"
                :swatches="accents"
                helper="Used for buttons, links, and highlights."
                teleport-to="body"
              >
                Accent color
              </ColorPicker>
            </div>

            <Text
              muted
              size="sm"
            >
              Changes are saved as you make them.
            </Text>
          </div>
        </Card>
      </template>
    </Tabs>

    <ConfirmDialog
      :open="confirmingDelete"
      title="Delete your account?"
      confirm-phrase="DELETE"
      @confirm="deleteAccount"
      @close="confirmingDelete = false"
    >
      <Text size="sm">
        Your profile, projects, and files will be removed for good. Other people
        will no longer be able to find you.
      </Text>
    </ConfirmDialog>

    <!-- At the top, as the bottom navigation takes the bottom edge on phones. -->
    <ToastStack
      ref="toasts"
      position="top-center"
    />
  </AppShell>
</template>
