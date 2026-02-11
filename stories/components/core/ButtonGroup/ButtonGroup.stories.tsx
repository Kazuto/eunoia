import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Button from "../Button/Button.vue";
import ButtonGroup from "./ButtonGroup.vue";

const meta = {
  component: ButtonGroup,
  tags: ["autodocs"],
  argTypes: {
    ariaLabel: { control: "text" },
    default: {
      control: false,
      description: "Default slot content (buttons)",
      table: {
        category: "slots",
        type: { summary: "html" },
      },
    },
  },
  args: {
    ariaLabel: "Actions",
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args: any) => ({
    setup() {
      return () => (
        <ButtonGroup {...args}>
          <Button>Left</Button>
          <Button>Center</Button>
          <Button>Right</Button>
        </ButtonGroup>
      );
    },
  }),
};

export const Primary: Story = {
  render: (args: any) => ({
    setup() {
      return () => (
        <ButtonGroup {...args}>
          <Button primary>Left</Button>
          <Button primary>Center</Button>
          <Button primary>Right</Button>
        </ButtonGroup>
      );
    },
  }),
};

export const TwoButtons: Story = {
  render: (args: any) => ({
    setup() {
      return () => (
        <ButtonGroup {...args}>
          <Button>Left</Button>
          <Button>Right</Button>
        </ButtonGroup>
      );
    },
  }),
};

export const Mixed: Story = {
  render: (args: any) => ({
    setup() {
      return () => (
        <ButtonGroup {...args}>
          <Button primary>Save</Button>
          <Button>Cancel</Button>
          <Button destructive>Delete</Button>
        </ButtonGroup>
      );
    },
  }),
};

export const Dense: Story = {
  render: (args: any) => ({
    setup() {
      return () => (
        <ButtonGroup {...args}>
          <Button dense>Left</Button>
          <Button dense>Center</Button>
          <Button dense>Right</Button>
        </ButtonGroup>
      );
    },
  }),
};

export const WithIcons: Story = {
  render: (args: any) => ({
    setup() {
      return () => (
        <ButtonGroup {...args}>
          <Button icon="bold" />
          <Button icon="italic" />
          <Button icon="underline" />
        </ButtonGroup>
      );
    },
  }),
  args: {
    ariaLabel: "Text formatting",
  },
};
