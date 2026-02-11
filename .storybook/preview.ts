import type { Preview } from "@storybook/vue3-vite";
import "highlight.js/lib/common";
import "highlight.js/styles/github.css";
import "../stories/storybook.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
