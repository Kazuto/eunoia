import type { Preview } from "@storybook/vue3-vite";
import "highlight.js/lib/common";
import "highlight.js/styles/github.css";
import "../stories/storybook.css";
import { themes } from "storybook/theming";
import { Card } from "@/components";

export const globalTypes = {
  darkMode: {
    name: "Dark Mode",
    description: "Toggle dark mode",
    defaultValue: false,
    toolbar: {
      icon: "circlehollow", // icon changes automatically
      items: [
        { value: false, icon: "circlehollow", title: "Light" },
        { value: true, icon: "circle", title: "Dark" },
      ],
      dynamicTitle: true,
    },
  },
};

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: ["concept", "components", "composables", "example", "*"],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (story, context) => {
      const isDark = context.globals.darkMode;

      document.documentElement.classList.toggle("dark", isDark);
      context.parameters.docs.theme = isDark ? themes.dark : themes.light;

      const unwrapped =
        (context.parameters.unwrapped as boolean | undefined) ?? false;

      if (unwrapped) {
        return {
          components: { story },
          template:
            '<div class="bg-white dark:bg-neutral-900 min-h-svh"><story /></div>',
        } as ReturnType<typeof story>;
      }

      return {
        components: { Card, story },
        template: "<Card><story /></Card>",
      } as ReturnType<typeof story>;
    },
  ],
};

export default preview;
