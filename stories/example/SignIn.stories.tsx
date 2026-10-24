import { fn } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import SignInPage from "./SignIn.vue";

/**
 * A standalone sign-in page: field validation on submit, a loading state, an
 * error for wrong credentials, and a confirmation once signed in.
 *
 * Any email address with the password **eunoia** signs in; every other
 * password shows the error.
 */
const meta = {
  component: SignInPage,
  title: "example/Sign In",
  parameters: {
    layout: "fullscreen",
    unwrapped: true,
  },
  args: {
    onSignIn: fn(),
    onNavigate: fn(),
  },
} satisfies Meta<typeof SignInPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SignIn: Story = {};
