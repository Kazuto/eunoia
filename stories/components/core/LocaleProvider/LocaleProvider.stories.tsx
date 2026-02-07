import { ref } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import LocaleProvider from "./LocaleProvider.vue";
import Input from "../../form/Input/Input.vue";

const meta = {
  component: LocaleProvider,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A renderless provider that supplies translated ARIA strings to form components via Vue's provide/inject. " +
          "Resolution priority: per-instance `locale` prop > injected provider > English defaults (from `locales/en.json`).",
      },
    },
  },
} satisfies Meta<typeof LocaleProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Without a LocaleProvider, components use built-in English defaults from `locale.json`.
 * Inspect the increment/decrement and show/hide buttons in the DOM
 * to see `aria-label="Increase value"`, `aria-label="Show password"`, etc.
 */
export const EnglishDefaults: Story = {
  render: () => ({
    setup() {
      const num = ref<number>();
      const pass = ref<string>();

      return () => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            maxWidth: "320px",
          }}
        >
          <Input type="number" v-model={num.value}>
            Amount
          </Input>
          <Input type="password" v-model={pass.value}>
            Password
          </Input>
        </div>
      );
    },
  }),
};

/**
 * Wrap components in a `LocaleProvider` to override ARIA strings globally.
 * Keys use dot-notation: `"input.number.increase-value"`, `"input.password.show-password"`, etc.
 */
export const GlobalProvider: Story = {
  render: () => ({
    setup() {
      const num = ref<number>();
      const pass = ref<string>();

      const dutchLocale = {
        "input.number.increase-value": "Verhoog waarde",
        "input.number.decrease-value": "Verlaag waarde",
        "input.password.show-password": "Toon wachtwoord",
        "input.password.hide-password": "Verberg wachtwoord",
      };

      return () => (
        <LocaleProvider locale={dutchLocale}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              maxWidth: "320px",
            }}
          >
            <Input type="number" v-model={num.value}>
              Hoeveelheid
            </Input>
            <Input type="password" v-model={pass.value}>
              Wachtwoord
            </Input>
          </div>
        </LocaleProvider>
      );
    },
  }),
};

/**
 * You only need to provide the keys you want to override.
 * Unprovided keys fall back to English defaults.
 * Here only `input.number.increase-value` is overridden — `decrease-value` stays English.
 */
export const PartialOverride: Story = {
  render: () => ({
    setup() {
      const num = ref<number>();

      const partial = {
        "input.number.increase-value": "Mehr",
      };

      return () => (
        <LocaleProvider locale={partial}>
          <div style={{ maxWidth: "320px" }}>
            <Input type="number" v-model={num.value}>
              Menge
            </Input>
          </div>
        </LocaleProvider>
      );
    },
  }),
};

/**
 * Per-instance `locale` props on individual inputs take highest priority,
 * overriding both the provider and English defaults.
 * Instance props use short keys without the prefix (e.g. `"show-password"` instead of `"input.password.show-password"`).
 * Here the provider sets Dutch, but the password input uses Japanese per-instance overrides.
 */
export const PerInstanceOverride: Story = {
  render: () => ({
    setup() {
      const num = ref<number>();
      const pass = ref<string>();

      const dutchLocale = {
        "input.number.increase-value": "Verhoog waarde",
        "input.number.decrease-value": "Verlaag waarde",
        "input.password.show-password": "Toon wachtwoord",
        "input.password.hide-password": "Verberg wachtwoord",
      };

      const japanesePassword = {
        "show-password": "パスワードを表示",
        "hide-password": "パスワードを隠す",
      };

      return () => (
        <LocaleProvider locale={dutchLocale}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              maxWidth: "320px",
            }}
          >
            <Input type="number" v-model={num.value}>
              Hoeveelheid (Dutch via provider)
            </Input>
            <Input
              type="password"
              v-model={pass.value}
              locale={japanesePassword}
            >
              パスワード (Japanese via instance prop)
            </Input>
          </div>
        </LocaleProvider>
      );
    },
  }),
};
