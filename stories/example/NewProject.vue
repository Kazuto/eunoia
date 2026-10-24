<script lang="ts" setup>
import { computed, nextTick, ref, useTemplateRef, watch } from "vue";
import {
  Avatar,
  Button,
  Card,
  Chip,
  Combobox,
  DatePicker,
  DescriptionItem,
  DescriptionList,
  EmptyState,
  FormGroup,
  Headline,
  Input,
  Progress,
  RadioGroup,
  Stepper,
  Switch,
  Text,
  Textarea,
} from "@/components";
import type { StepperStepItem } from "@/components";
import type { HeaderAction } from "@/types";
import AppShell from "./AppShell.vue";

export type NewProject = {
  name: string;
  description: string;
  dueDate: Date | null;
  members: string[];
  visibility: Visibility;
  notifyMembers: boolean;
  allowComments: boolean;
};

type Visibility = "private" | "team" | "public";

const emit = defineEmits<{
  (e: "create", project: NewProject): void;
  /** A link inside the app was followed, e.g. to hand it to a router. */
  (e: "navigate", path: string): void;
}>();

const backAction: HeaderAction = {
  content: "Back to projects",
  onClick: () => emit("navigate", "/projects"),
};

const steps: StepperStepItem[] = [
  { label: "Details" },
  { label: "Team" },
  { label: "Settings" },
  { label: "Review" },
];
const REVIEW = steps.length - 1;

const people = [
  { value: "bob", label: "Bob Smith", role: "Designer" },
  { value: "carol", label: "Carol White", role: "Manager" },
  { value: "david", label: "David Lee", role: "Engineer" },
  { value: "eva", label: "Eva Martinez", role: "QA" },
  { value: "frank", label: "Frank Müller", role: "Engineer" },
  { value: "grace", label: "Grace Kim", role: "Product Manager" },
];
const OWNER = "Alice Johnson";

const visibilityOptions = [
  { label: "Private", value: "private" },
  { label: "Team", value: "team" },
  { label: "Public", value: "public" },
];
const visibilityHelp: Record<Visibility, string> = {
  private: "Only you and the members you add can see it.",
  team: "Everyone at Acme can see it; members can make changes.",
  public: "Anyone with the link can view it.",
};

const name = ref("");
const description = ref("");
const dueDate = ref<Date | null>(null);
const members = ref<string[]>([]);
const visibility = ref<Visibility>("team");
const notifyMembers = ref(true);
const allowComments = ref(false);

const step = ref(0);
/** Set after "Edit" on the review, so the user can head straight back. */
const returnToReview = ref(false);
const triedToContinue = ref(false);
const created = ref(false);

// Details are checked once the user tried to move on, then as they type.
const nameErrors = computed(() => {
  if (!triedToContinue.value) return [];
  if (!name.value.trim()) return ["Give the project a name"];
  return [];
});
const dueDateErrors = computed(() => {
  if (!triedToContinue.value || !dueDate.value) return [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dueDate.value < today ? ["Pick a date that isn't in the past"] : [];
});

const stepErrors = computed(() =>
  step.value === 0 ? [...nameErrors.value, ...dueDateErrors.value] : []
);

const newMember = ref<string | number | null>(null);
const memberOptions = computed(() =>
  people.filter((person) => !members.value.includes(person.value))
);
const memberNames = computed(() =>
  members.value.map(
    (value) => people.find((person) => person.value === value)?.label ?? value
  )
);

// Picking someone adds them and clears the field for the next one.
watch(newMember, (value) => {
  if (value == null) return;
  members.value.push(String(value));
  newMember.value = null;
});

function removeMember(value: string) {
  members.value = members.value.filter((member) => member !== value);
}

const form = useTemplateRef<HTMLFormElement>("form");
const heading = useTemplateRef<HTMLElement>("heading");

async function next() {
  triedToContinue.value = true;
  if (stepErrors.value.length) {
    await nextTick();
    form.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    return;
  }
  triedToContinue.value = false;

  if (step.value === REVIEW) return create();
  step.value = returnToReview.value ? REVIEW : step.value + 1;
}

function back() {
  step.value = Math.max(0, step.value - 1);
}

function edit(index: number) {
  returnToReview.value = true;
  step.value = index;
}

// Each step starts at its heading, so screen readers hear where they are.
watch(step, async (value) => {
  if (value === REVIEW) returnToReview.value = false;
  await nextTick();
  heading.value?.querySelector<HTMLElement>("h2")?.focus();
});

function create() {
  emit("create", {
    name: name.value.trim(),
    description: description.value.trim(),
    dueDate: dueDate.value,
    members: [...members.value],
    visibility: visibility.value,
    notifyMembers: notifyMembers.value,
    allowComments: allowComments.value,
  });
  created.value = true;
}

function startOver() {
  name.value = "";
  description.value = "";
  dueDate.value = null;
  members.value = [];
  visibility.value = "team";
  notifyMembers.value = true;
  allowComments.value = false;
  returnToReview.value = false;
  triedToContinue.value = false;
  created.value = false;
  step.value = 0;
}

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "long" });

/** What the review lists, one section per step that has an "Edit" button. */
const reviewSections = computed(() => [
  {
    title: "Details",
    items: [
      { term: "Name", description: name.value.trim() },
      { term: "Description", description: description.value.trim() || "None" },
      {
        term: "Due date",
        description: dueDate.value
          ? dateFormat.format(dueDate.value)
          : "No due date",
      },
    ],
  },
  {
    title: "Team",
    items: [
      {
        term: "Members",
        description: [`${OWNER} (you)`, ...memberNames.value].join(", "),
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        term: "Visibility",
        description:
          visibilityOptions.find((option) => option.value === visibility.value)
            ?.label ?? visibility.value,
      },
      {
        term: "Email members",
        description: notifyMembers.value ? "On" : "Off",
      },
      {
        term: "Comments",
        description: allowComments.value ? "Allowed" : "Off",
      },
    ],
  },
]);

const primaryLabel = computed(() => {
  if (step.value === REVIEW) return "Create project";
  if (returnToReview.value) return "Back to review";
  return "Next";
});
</script>

<template>
  <AppShell
    title="New project"
    current-path="/projects/new"
    width="narrow"
    :back-action
    @navigate="emit('navigate', $event)"
  >
    <Card v-if="created">
      <EmptyState
        icon="check-circle"
        title="Project created"
        heading-tag="h2"
        :description="`${name.trim()} is ready. ${
          members.length
            ? `${members.length} ${members.length === 1 ? 'member was' : 'members were'} invited.`
            : 'Add members whenever you like.'
        }`"
      >
        <Button
          primary
          href="/projects/new-project"
        >
          Open project
        </Button>
        <Button
          type="button"
          @click="startOver"
        >
          Create another
        </Button>
      </EmptyState>
    </Card>

    <div
      v-else
      class="flex flex-col gap-6"
    >
      <!-- The steps' labels don't fit side by side on phones. -->
      <div class="flex flex-col gap-2 sm:hidden">
        <Text
          muted
          size="sm"
        >
          Step {{ step + 1 }} of {{ steps.length }}
        </Text>
        <Progress
          :value="step + 1"
          :max="steps.length"
          dense
          aria-hidden="true"
        />
      </div>
      <Stepper
        v-model="step"
        :steps
        clickable
        aria-label="New project"
        class="max-sm:hidden"
      />

      <Card>
        <div
          ref="heading"
          class="mb-5"
        >
          <Headline
            :level="2"
            :scale="5"
            tabindex="-1"
            class="outline-none"
          >
            {{ steps[step]?.label }}
          </Headline>
        </div>

        <form
          id="new-project"
          ref="form"
          class="flex flex-col gap-5"
          novalidate
          @submit.prevent="next"
        >
          <template v-if="step === 0">
            <Input
              v-model="name"
              name="name"
              :maxlength="60"
              :errors="nameErrors"
              :invalid="nameErrors.length > 0"
            >
              Name
            </Input>
            <Textarea
              v-model="description"
              name="description"
              helper="What the project is for, in a sentence or two. Optional."
            >
              Description
            </Textarea>
            <DatePicker
              v-model="dueDate"
              placeholder="No due date"
              helper="Optional."
              :errors="dueDateErrors"
              :invalid="dueDateErrors.length > 0"
            >
              Due date
            </DatePicker>
          </template>

          <template v-else-if="step === 1">
            <Combobox
              v-model="newMember"
              :options="memberOptions"
              placeholder="Search people"
            >
              Add members
            </Combobox>
            <FormGroup aria-label="Members">
              <template #label>Members</template>
              <ul class="flex flex-wrap gap-2">
                <li>
                  <Chip variant="secondary">
                    <span class="flex items-center gap-1.5">
                      <Avatar
                        :name="OWNER"
                        size="xs"
                      />
                      {{ OWNER }} (you)
                    </span>
                  </Chip>
                </li>
                <li
                  v-for="(member, index) in members"
                  :key="member"
                >
                  <Chip
                    variant="secondary"
                    removable
                    @remove="removeMember(member)"
                  >
                    <span class="flex items-center gap-1.5">
                      <Avatar
                        :name="memberNames[index]"
                        size="xs"
                      />
                      {{ memberNames[index] }}
                    </span>
                  </Chip>
                </li>
              </ul>
            </FormGroup>
            <Text
              v-if="!members.length"
              muted
              size="sm"
            >
              You can also add members later, from the project's settings.
            </Text>
          </template>

          <template v-else-if="step === 2">
            <FormGroup
              :helper="visibilityHelp[visibility]"
              aria-label="Visibility"
            >
              <template #label>Visibility</template>
              <RadioGroup
                v-model="visibility"
                :options="visibilityOptions"
              />
            </FormGroup>
            <FormGroup aria-label="Notifications">
              <template #label>Notifications</template>
              <div class="flex flex-col gap-3 pt-1">
                <Switch v-model="notifyMembers">
                  Email members when they're added
                </Switch>
                <Switch v-model="allowComments">
                  Let people who can view it comment
                </Switch>
              </div>
            </FormGroup>
          </template>

          <template v-else>
            <section
              v-for="(section, index) in reviewSections"
              :key="section.title"
              class="flex flex-col gap-2"
            >
              <div class="flex items-center justify-between gap-3">
                <Headline
                  :level="3"
                  :scale="6"
                >
                  {{ section.title }}
                </Headline>
                <Button
                  type="button"
                  ghost
                  dense
                  icon="pencil-simple"
                  :aria-label="`Edit ${section.title.toLowerCase()}`"
                  @click="edit(index)"
                >
                  Edit
                </Button>
              </div>
              <DescriptionList dense>
                <DescriptionItem
                  v-for="item in section.items"
                  :key="item.term"
                  :term="item.term"
                >
                  {{ item.description }}
                </DescriptionItem>
              </DescriptionList>
            </section>
          </template>
        </form>

        <template #footer>
          <Button
            v-if="step > 0"
            type="button"
            @click="back"
          >
            Back
          </Button>
          <Button
            primary
            type="submit"
            form="new-project"
            class="ml-auto"
            :icon="step === REVIEW ? 'check' : undefined"
          >
            {{ primaryLabel }}
          </Button>
        </template>
      </Card>
    </div>
  </AppShell>
</template>
