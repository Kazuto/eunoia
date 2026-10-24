import { fn } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import NewProjectPage from "./NewProject.vue";

/**
 * A multi-step form: each step is checked before moving on, the review lists
 * everything with a way back to each step, and creating the project ends on a
 * confirmation.
 */
const meta = {
  component: NewProjectPage,
  title: "example/New Project",
  parameters: {
    layout: "fullscreen",
    unwrapped: true,
  },
  args: {
    onCreate: fn(),
    onNavigate: fn(),
  },
} satisfies Meta<typeof NewProjectPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NewProject: Story = {};
