import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import FormGroup from "./FormGroup.vue";
import Radio from "../Radio/Radio.vue";
import Checkbox from "../Checkbox/Checkbox.vue";

const meta = {
  component: FormGroup,
  tags: ["autodocs"],
  argTypes: {
    dense: {
      control: "boolean",
      description: "Compact sizing",
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
} satisfies Meta<typeof FormGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RadioGroup: Story = {
  render: (args) => ({
    components: { FormGroup, Radio },
    setup() {
      const selected = ref("");
      return { args, selected };
    },
    template: `
      <FormGroup v-bind="args">
        <template #label>Do you agree to the terms?</template>
        <div class="flex flex-col gap-2">
          <Radio v-model="selected" value="yes">
            <template #description>Yes</template>
          </Radio>
          <Radio v-model="selected" value="no">
            <template #description>No</template>
          </Radio>
        </div>
      </FormGroup>
    `,
  }),
};

export const RadioGroupWithError: Story = {
  args: {
    errors: ["Please select an option"],
  },
  render: (args) => ({
    components: { FormGroup, Radio },
    setup() {
      const selected = ref("");
      return { args, selected };
    },
    template: `
      <FormGroup v-bind="args">
        <template #label>Do you agree to the terms?</template>
        <div class="flex flex-col gap-2">
          <Radio v-model="selected" value="yes" :invalid="!!args.errors?.length">
            <template #description>Yes</template>
          </Radio>
          <Radio v-model="selected" value="no" :invalid="!!args.errors?.length">
            <template #description>No</template>
          </Radio>
        </div>
      </FormGroup>
    `,
  }),
};

export const RadioGroupWithHelper: Story = {
  args: {
    helper: "This is required to continue",
  },
  render: (args) => ({
    components: { FormGroup, Radio },
    setup() {
      const selected = ref("yes");
      return { args, selected };
    },
    template: `
      <FormGroup v-bind="args">
        <template #label>Subscribe to newsletter?</template>
        <div class="flex flex-col gap-2">
          <Radio v-model="selected" value="yes">
            <template #description>Yes, keep me updated</template>
          </Radio>
          <Radio v-model="selected" value="no">
            <template #description>No thanks</template>
          </Radio>
        </div>
      </FormGroup>
    `,
  }),
};

export const CheckboxGroup: Story = {
  render: () => ({
    components: { FormGroup, Checkbox },
    setup() {
      const features = ref({
        notifications: false,
        newsletter: false,
        analytics: false,
      });
      return { features };
    },
    template: `
      <FormGroup>
        <template #label>Select features</template>
        <div class="flex flex-col gap-2">
          <Checkbox v-model="features.notifications">
            <template #description>Enable notifications</template>
          </Checkbox>
          <Checkbox v-model="features.newsletter">
            <template #description>Subscribe to newsletter</template>
          </Checkbox>
          <Checkbox v-model="features.analytics">
            <template #description>Share analytics data</template>
          </Checkbox>
        </div>
      </FormGroup>
    `,
  }),
};

export const Dense: Story = {
  args: {
    dense: true,
  },
  render: (args) => ({
    components: { FormGroup, Radio },
    setup() {
      const selected = ref("small");
      return { args, selected };
    },
    template: `
      <FormGroup v-bind="args">
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
