import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import Radio from "./Radio.vue";
import FormGroup from "../FormGroup/FormGroup.vue";

const meta = {
  component: Radio,
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "text",
      description: "The value of this radio button",
    },
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
    helper: {
      control: "text",
      description: "Helper text",
    },
    errors: {
      control: "object",
      description: "Error messages",
    },
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    components: { Radio, FormGroup },
    setup() {
      const selected = ref("option1");
      return { selected };
    },
    template: `
      <FormGroup>
        <template #label>Choose an option</template>
        <div class="flex flex-col gap-2">
          <Radio v-model="selected" value="option1">
            <template #description>Option 1</template>
          </Radio>
          <Radio v-model="selected" value="option2">
            <template #description>Option 2</template>
          </Radio>
          <Radio v-model="selected" value="option3">
            <template #description>Option 3</template>
          </Radio>
        </div>
        <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Selected: {{ selected }}</p>
      </FormGroup>
    `,
  }),
};

export const WithError: Story = {
  render: () => ({
    components: { Radio, FormGroup },
    setup() {
      const selected = ref("");
      const hasError = ref(true);
      return { selected, hasError };
    },
    template: `
      <FormGroup :errors="hasError ? ['Please select an option'] : undefined">
        <template #label>Do you agree to the terms?</template>
        <div class="flex flex-col gap-2">
          <Radio v-model="selected" value="yes" :invalid="hasError">
            <template #description>Yes</template>
          </Radio>
          <Radio v-model="selected" value="no" :invalid="hasError">
            <template #description>No</template>
          </Radio>
        </div>
      </FormGroup>
    `,
  }),
};

export const WithHelper: Story = {
  render: () => ({
    components: { Radio, FormGroup },
    setup() {
      const selected = ref("basic");
      return { selected };
    },
    template: `
      <FormGroup helper="Choose the plan that best fits your needs">
        <template #label>Select a plan</template>
        <div class="flex flex-col gap-2">
          <Radio v-model="selected" value="basic">
            <template #description>Basic Plan</template>
          </Radio>
          <Radio v-model="selected" value="pro">
            <template #description>Pro Plan</template>
          </Radio>
          <Radio v-model="selected" value="enterprise">
            <template #description>Enterprise Plan</template>
          </Radio>
        </div>
      </FormGroup>
    `,
  }),
};

export const Dense: Story = {
  render: () => ({
    components: { Radio, FormGroup },
    setup() {
      const selected = ref("small");
      return { selected };
    },
    template: `
      <FormGroup dense>
        <template #label>Size</template>
        <div class="flex flex-col gap-2">
          <Radio v-model="selected" value="small" dense>
            <template #description>Small</template>
          </Radio>
          <Radio v-model="selected" value="medium" dense>
            <template #description>Medium</template>
          </Radio>
          <Radio v-model="selected" value="large" dense>
            <template #description>Large</template>
          </Radio>
        </div>
      </FormGroup>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    components: { Radio, FormGroup },
    setup() {
      const selected = ref("enabled");
      return { selected };
    },
    template: `
      <FormGroup>
        <template #label>Select an option</template>
        <div class="flex flex-col gap-2">
          <Radio v-model="selected" value="enabled">
            <template #description>Enabled option</template>
          </Radio>
          <Radio v-model="selected" value="disabled" disabled>
            <template #description>Disabled option</template>
          </Radio>
          <Radio v-model="selected" value="another">
            <template #description>Another option</template>
          </Radio>
        </div>
      </FormGroup>
    `,
  }),
};
