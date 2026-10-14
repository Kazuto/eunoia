import { fn } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { Tabs, type TabItem } from "@/components";
import { ref } from "vue";

const items: TabItem[] = [
  { value: "overview", label: "Overview" },
  { value: "activity", label: "Activity" },
  { value: "settings", label: "Settings" },
];

const meta = {
  component: Tabs,
  tags: ["autodocs"],
  argTypes: {
    dense: {
      control: "boolean",
      description: "Compact sizing",
    },
    items: {
      control: "object",
      description: "Tabs as `{ value, label, disabled? }`",
    },
  },
  args: {
    items,
    ariaLabel: "Sections",
    "onUpdate:modelValue": fn(),
  },
  render: (args) => ({
    components: { Tabs },
    setup() {
      const tab = ref("overview");
      return { args, tab };
    },
    template: `
      <Tabs v-bind="args" v-model="tab" panel-class="pt-4">
        <template #default="{ item }">
          <p class="text-sm text-neutral-500">Content for {{ item.label }}.</p>
        </template>
      </Tabs>
    `,
  }),
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dense: Story = {
  args: { dense: true },
};

export const WithDisabledTab: Story = {
  args: {
    items: [
      { value: "overview", label: "Overview" },
      { value: "activity", label: "Activity", disabled: true },
      { value: "settings", label: "Settings" },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Disabled tabs are skipped by the arrow keys and can't be selected.",
      },
    },
  },
};

export const InScrollablePanel: Story = {
  render: (args) => ({
    components: { Tabs },
    setup() {
      const tab = ref("overview");
      return { args, tab };
    },
    template: `
      <div class="flex h-80 flex-col rounded-md border border-neutral-200 dark:border-neutral-700">
        <Tabs
          v-bind="args"
          v-model="tab"
          class="flex min-h-0 flex-1 flex-col"
          list-class="border-b border-neutral-200 p-3 dark:border-neutral-700"
          panel-class="min-h-0 flex-1 overflow-y-auto p-4"
        >
          <template #default="{ item }">
            <p v-for="line in 20" :key="line" class="text-sm text-neutral-500">
              {{ item.label }} — line {{ line }}
            </p>
          </template>
        </Tabs>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "`listClass` and `panelClass` place the tab row and panel, e.g. a fixed row above a scrolling panel.",
      },
    },
  },
};
