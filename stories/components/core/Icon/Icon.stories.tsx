import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Icon from "./Icon.vue";

const meta = {
  component: Icon,
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    type: {
      control: "select",
      options: ["thin", "light", "regular", "bold", "fill", "duotone"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
  },
  args: {
    name: "house",
    type: "regular",
    size: "md",
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => ({
    components: { Icon },
    template: `
      <div class="flex items-end gap-4">
        <div class="flex flex-col items-center gap-1">
          <Icon name="house" size="xs" />
          <span class="text-xs text-gray-500">xs</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <Icon name="house" size="sm" />
          <span class="text-xs text-gray-500">sm</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <Icon name="house" size="md" />
          <span class="text-xs text-gray-500">md</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <Icon name="house" size="lg" />
          <span class="text-xs text-gray-500">lg</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <Icon name="house" size="xl" />
          <span class="text-xs text-gray-500">xl</span>
        </div>
      </div>
    `,
  }),
};

export const Types: Story = {
  render: () => ({
    components: { Icon },
    template: `
      <div class="flex items-end gap-4">
        <div class="flex flex-col items-center gap-1">
          <Icon name="house" type="thin" size="lg" />
          <span class="text-xs text-gray-500">thin</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <Icon name="house" type="light" size="lg" />
          <span class="text-xs text-gray-500">light</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <Icon name="house" type="regular" size="lg" />
          <span class="text-xs text-gray-500">regular</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <Icon name="house" type="bold" size="lg" />
          <span class="text-xs text-gray-500">bold</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <Icon name="house" type="fill" size="lg" />
          <span class="text-xs text-gray-500">fill</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <Icon name="house" type="duotone" size="lg" />
          <span class="text-xs text-gray-500">duotone</span>
        </div>
      </div>
    `,
  }),
};

export const Gallery: Story = {
  render: () => ({
    components: { Icon },
    setup: () => ({
      names: [
        "house",
        "user",
        "gear",
        "envelope",
        "bell",
        "magnifying-glass",
        "heart",
        "star",
        "trash",
        "pencil-simple",
        "eye",
        "check",
        "x",
        "plus",
        "caret-right",
      ],
    }),
    template: `
      <div class="grid grid-cols-5 gap-4">
        <div
          v-for="name in names"
          :key="name"
          class="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4"
        >
          <Icon :name="name" size="lg" />
          <span class="text-xs text-gray-500">{{ name }}</span>
        </div>
      </div>
    `,
  }),
};
