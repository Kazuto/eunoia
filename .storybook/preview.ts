import type { Preview } from "@storybook/vue3-vite";
import "highlight.js/lib/common";
import "highlight.js/styles/github.css";
import "../stories/storybook.css";
import { themes } from "storybook/theming";

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

      return {
        components: { story },
        template: "<story />",
      };
    },
  ],
};

export default preview;
