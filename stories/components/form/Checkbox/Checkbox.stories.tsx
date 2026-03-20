import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import Checkbox from "./Checkbox.vue";
import FormGroup from "../FormGroup/FormGroup.vue";

const meta = {
  title: "Components/Form/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    dense: {
      control: "boolean",
      description: "Compact sizing",
    },
    invalid: {
      control: "boolean",
      description: "Invalid state",
    },
    disabled: {
      control: "boolean",
      description: "Disabled state",
    },
    indeterminate: {
      control: "boolean",
      description: "Indeterminate state",
    },
    helper: {
      control: "text",
      description: "Helper text",
    },
    errors: {
      control: "object",
      description: "Error messages",
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { Checkbox },
    setup() {
      const checked = ref(false);
      return { args, checked };
    },
    template: `
      <Checkbox v-bind="args" v-model="checked">
        <template #description>I agree to the terms and conditions</template>
      </Checkbox>
      <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Checked: {{ checked }}</p>
    `,
  }),
};

export const Checked: Story = {
  render: (args) => ({
    components: { Checkbox },
    setup() {
      const checked = ref(true);
      return { args, checked };
    },
    template: `
      <Checkbox v-bind="args" v-model="checked">
        <template #description>Subscribe to newsletter</template>
      </Checkbox>
    `,
  }),
};

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
  },
  render: (args) => ({
    components: { Checkbox },
    setup() {
      const checked = ref(false);
      return { args, checked };
    },
    template: `
      <Checkbox v-bind="args" v-model="checked">
        <template #description>Select all (some selected)</template>
      </Checkbox>
    `,
  }),
};

export const WithHelper: Story = {
  args: {
    helper: "You can change this later in settings",
  },
  render: (args) => ({
    components: { Checkbox },
    setup() {
      const checked = ref(false);
      return { args, checked };
    },
    template: `
      <Checkbox v-bind="args" v-model="checked">
        <template #description>Enable notifications</template>
      </Checkbox>
    `,
  }),
};

export const WithError: Story = {
  args: {
    invalid: true,
    errors: ["You must accept the terms to continue"],
  },
  render: (args) => ({
    components: { Checkbox },
    setup() {
      const checked = ref(false);
      return { args, checked };
    },
    template: `
      <Checkbox v-bind="args" v-model="checked">
        <template #description>I accept the terms of service</template>
      </Checkbox>
    `,
  }),
};

export const Dense: Story = {
  args: {
    dense: true,
  },
  render: (args) => ({
    components: { Checkbox },
    setup() {
      const checked = ref(false);
      return { args, checked };
    },
    template: `
      <Checkbox v-bind="args" v-model="checked">
        <template #description>Compact checkbox</template>
      </Checkbox>
    `,
  }),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => ({
    components: { Checkbox },
    setup() {
      const checked = ref(false);
      return { args, checked };
    },
    template: `
      <Checkbox v-bind="args" v-model="checked">
        <template #description>Disabled option</template>
      </Checkbox>
    `,
  }),
};

export const MultipleWithFormGroup: Story = {
  render: () => ({
    components: { Checkbox, FormGroup },
    setup() {
      const preferences = ref({
        notifications: false,
        newsletter: false,
        analytics: false,
      });
      return { preferences };
    },
    template: `
      <FormGroup helper="You can change these later in settings">
        <template #label>Select your preferences</template>
        <div class="flex flex-col gap-2">
          <Checkbox v-model="preferences.notifications">
            <template #description>Enable push notifications</template>
          </Checkbox>
          <Checkbox v-model="preferences.newsletter">
            <template #description>Subscribe to newsletter</template>
          </Checkbox>
          <Checkbox v-model="preferences.analytics">
            <template #description>Share analytics data</template>
          </Checkbox>
        </div>
      </FormGroup>
    `,
  }),
};
