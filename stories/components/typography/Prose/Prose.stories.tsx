import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { Badge } from "@/components";
import Prose from "./Prose.vue";

const article = `
<h2>Getting started</h2>
<p>Eunoia renders <strong>rendered Markdown</strong> and CMS content with the same type scale as the components. Read the <a href="#">installation guide</a> first, then import <code>styles.css</code> once in your app.</p>
<h3>What you need</h3>
<ul>
  <li>Vue 3.5 or later</li>
  <li>Tailwind CSS 4
    <ul><li>with the Vite plugin</li></ul>
  </li>
  <li>A sanitizer if the HTML comes from users</li>
</ul>
<ol>
  <li>Install the package</li>
  <li>Import the stylesheet</li>
  <li>Wrap your content in Prose</li>
</ol>
<blockquote><p>Typography is the craft of endowing human language with a durable visual form.</p></blockquote>
<pre><code>import { Prose } from "@thkzt/eunoia";</code></pre>
<table>
  <thead><tr><th>Size</th><th>Font size</th><th>Use for</th></tr></thead>
  <tbody>
    <tr><td>sm</td><td>14px</td><td>Sidebars and help text</td></tr>
    <tr><td>base</td><td>16px</td><td>Articles</td></tr>
    <tr><td>lg</td><td>18px</td><td>Landing pages</td></tr>
  </tbody>
</table>
<hr />
<p>Search results can <mark>highlight</mark> the matching words.</p>
`;

const meta = {
  component: Prose,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "base", "lg"] },
    as: { control: "text" },
  },
  args: {
    size: "base",
    as: "article",
  },
  render: (args: any) => ({
    setup() {
      return () => (
        <Prose
          {...args}
          class="max-w-prose"
          innerHTML={article}
        />
      );
    },
  }),
} satisfies Meta<typeof Prose>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: {
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
  },
};

export const WithComponents: Story = {
  render: (args: any) => ({
    setup() {
      return () => (
        <Prose
          {...args}
          class="max-w-prose"
        >
          <h2>Release 2.4</h2>
          <p>
            Components inside <code>not-prose</code> keep their own styles:
          </p>
          <div class="not-prose flex gap-2">
            <Badge variant="success">Stable</Badge>
            <Badge variant="secondary">Vue 3</Badge>
          </div>
          <p>Everything else follows the prose type scale.</p>
        </Prose>
      );
    },
  }),
};
