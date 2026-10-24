<script lang="ts" setup>
import { computed, nextTick, ref, useTemplateRef } from "vue";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Divider,
  EmptyState,
  Headline,
  Icon,
  Input,
  Link,
  Spinner,
  Text,
} from "@/components";

/** The password that signs in; any other one shows the error. */
const DEMO_PASSWORD = "eunoia";

const emit = defineEmits<{
  (e: "signIn", email: string): void;
  /** A link inside the app was followed, e.g. to hand it to a router. */
  (e: "navigate", path: string): void;
}>();

const email = ref("");
const password = ref("");
const remember = ref(true);

const submitted = ref(false);
const loading = ref(false);
const failedAttempts = ref(0);
const signedIn = ref(false);

const form = useTemplateRef<HTMLFormElement>("form");

// Errors show once the form was submitted, then follow along as the user types.
const emailErrors = computed(() => {
  if (!submitted.value) return [];
  if (!email.value.trim()) return ["Enter your email address"];
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    return ["Enter an email address like name@example.com"];
  }
  return [];
});
const passwordErrors = computed(() =>
  submitted.value && !password.value ? ["Enter your password"] : []
);

async function signIn() {
  submitted.value = true;
  if (emailErrors.value.length || passwordErrors.value.length) {
    await nextTick();
    form.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    return;
  }

  loading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  loading.value = false;

  if (password.value !== DEMO_PASSWORD) {
    failedAttempts.value++;
    password.value = "";
    submitted.value = false;
    return;
  }

  signedIn.value = true;
  emit("signIn", email.value.trim());
}

function signOut() {
  signedIn.value = false;
  password.value = "";
  submitted.value = false;
  failedAttempts.value = 0;
}

// Stands in for a router, as these links lead nowhere inside Storybook.
function followLink(event: MouseEvent) {
  const href = (event.target as Element)
    .closest("a[href]")
    ?.getAttribute("href");
  if (!href?.startsWith("/")) return;

  event.preventDefault();
  emit("navigate", href);
}
</script>

<template>
  <div
    class="flex min-h-svh flex-col items-center justify-center bg-neutral-50 px-4 py-10 font-sans dark:bg-neutral-950"
    @click.capture="followLink"
  >
    <div class="flex w-full max-w-sm flex-col gap-6">
      <div class="flex flex-col items-center gap-3 text-center">
        <span
          class="flex size-11 items-center justify-center rounded-[14px] bg-primary-500 text-white squircle"
        >
          <Icon
            name="cube"
            size="lg"
          />
        </span>
        <div class="flex flex-col gap-1">
          <Headline :scale="3">Sign in to Acme</Headline>
          <Text
            muted
            size="sm"
          >
            Welcome back. Enter your details to continue.
          </Text>
        </div>
      </div>

      <Card v-if="signedIn">
        <EmptyState
          icon="check-circle"
          title="You're signed in"
          heading-tag="h2"
          :description="`Signed in as ${email.trim()}.`"
        >
          <Button
            primary
            href="/"
          >
            Continue to dashboard
          </Button>
          <Button
            type="button"
            @click="signOut"
          >
            Sign out
          </Button>
        </EmptyState>
      </Card>

      <Card v-else>
        <form
          ref="form"
          class="flex flex-col gap-4"
          novalidate
          @submit.prevent="signIn"
        >
          <Alert
            v-if="failedAttempts"
            :key="failedAttempts"
            variant="danger"
            persistent
          >
            That email and password don't match. Check them and try again.
          </Alert>

          <Input
            v-model="email"
            type="email"
            name="email"
            autocomplete="email"
            :errors="emailErrors"
            :invalid="emailErrors.length > 0"
          >
            Email
          </Input>
          <Input
            v-model="password"
            type="password"
            name="password"
            autocomplete="current-password"
            :errors="passwordErrors"
            :invalid="passwordErrors.length > 0"
          >
            Password
          </Input>

          <div
            class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2"
          >
            <Checkbox v-model="remember">
              <template #description>Remember me</template>
            </Checkbox>
            <Link
              href="/forgot-password"
              dense
            >
              Forgot password?
            </Link>
          </div>

          <Button
            primary
            type="submit"
            class="w-full justify-center"
            :disabled="loading"
            :aria-busy="loading || undefined"
          >
            <!-- The button's text already says what's happening. -->
            <Spinner
              v-if="loading"
              size="xs"
              aria-hidden="true"
            />
            {{ loading ? "Signing in…" : "Sign in" }}
          </Button>
        </form>

        <Divider
          label="or"
          class="my-5"
        />

        <Button
          href="/sso"
          icon="key"
          class="w-full justify-center"
        >
          Sign in with SSO
        </Button>
      </Card>

      <Text
        v-if="!signedIn"
        muted
        size="sm"
        class="text-center"
      >
        New to Acme?
        <Link href="/sign-up">Create an account</Link>
      </Text>
    </div>
  </div>
</template>
