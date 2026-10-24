import { fn } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import SettingsPage from "./Settings.vue";

const meta = {
  component: SettingsPage,
  title: "example/Settings",
  parameters: {
    layout: "fullscreen",
    unwrapped: true,
  },
  args: {
    onNavigate: fn(),
    onSave: fn(),
    onDeleteAccount: fn(),
  },
} satisfies Meta<typeof SettingsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Settings: Story = {};
