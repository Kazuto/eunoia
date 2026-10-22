import {
  ref,
  type Ref,
  type MaybeRefOrGetter,
  onMounted,
  onUnmounted,
  toValue,
  watch,
} from "vue";

/**
 * Creates an animated typing placeholder that cycles through multiple strings.
 *
 * Users who ask for reduced motion get the first string, without animation. The
 * strings may be a ref or getter, e.g. translations, and the animation starts over
 * when they change.
 *
 * @param placeholders - Strings to cycle through
 * @param options - Configuration options for typing animation
 * @returns An object with the placeholder ref, animate function, and stop function
 *
 * @example
 * ```vue
 * <script setup>
 * // Auto-start animation (default behavior)
 * const { placeholder } = useTypingPlaceholder(['John Doe', 'Jane Smith', 'Alex Johnson']);
 *
 * // Follows the language
 * const { placeholder } = useTypingPlaceholder(() => [t('search.keys'), t('search.text')]);
 *
 * // Manual control
 * const { placeholder, animate, stop } = useTypingPlaceholder(
 *   ['John Doe', 'Jane Smith', 'Alex Johnson'],
 *   { autoStart: false, typingSpeed: 100, deletingSpeed: 50, pauseDuration: 2000 }
 * );
 *
 * // Manually start later
 * animate();
 * </script>
 *
 * <template>
 *   <input :placeholder="placeholder" />
 * </template>
 * ```
 */
export function useTypingPlaceholder(
  placeholders: MaybeRefOrGetter<string[]>,
  options: {
    typingSpeed?: number;
    deletingSpeed?: number;
    pauseDuration?: number;
    autoStart?: boolean;
  } = {}
): {
  placeholder: Ref<string>;
  animate: () => void;
  stop: () => void;
} {
  const {
    typingSpeed = 100,
    deletingSpeed = 50,
    pauseDuration = 2000,
    autoStart = true,
  } = options;

  const currentPlaceholder = ref("");
  const currentIndex = ref(0);
  const isDeleting = ref(false);
  const charIndex = ref(0);

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let started = false;

  const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const animate = () => {
    started = true;
    const list = toValue(placeholders);

    if (prefersReducedMotion()) {
      currentPlaceholder.value = list[0] ?? "";
      return;
    }

    const fullText = list[currentIndex.value];

    if (!fullText) return;

    if (!isDeleting.value) {
      // Typing
      if (charIndex.value < fullText.length) {
        currentPlaceholder.value = fullText.substring(0, charIndex.value + 1);
        charIndex.value++;
        timeoutId = setTimeout(animate, typingSpeed);
      } else {
        // Pause before deleting
        timeoutId = setTimeout(() => {
          isDeleting.value = true;
          animate();
        }, pauseDuration);
      }
    } else {
      // Deleting
      if (charIndex.value > 0) {
        currentPlaceholder.value = fullText.substring(0, charIndex.value - 1);
        charIndex.value--;
        timeoutId = setTimeout(animate, deletingSpeed);
      } else {
        // Move to next placeholder
        isDeleting.value = false;
        currentIndex.value = (currentIndex.value + 1) % list.length;
        timeoutId = setTimeout(animate, typingSpeed);
      }
    }
  };

  const stop = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  };

  // New strings, e.g. after a language change, start over from the first one.
  watch(
    () => [...toValue(placeholders)],
    (next, previous) => {
      if (next.join("\n") === previous?.join("\n")) return;
      stop();
      currentIndex.value = 0;
      charIndex.value = 0;
      isDeleting.value = false;
      currentPlaceholder.value = "";
      if (started) animate();
    }
  );

  // Register lifecycle hooks unconditionally, but only execute based on autoStart
  onMounted(() => {
    if (autoStart) {
      animate();
    }
  });

  onUnmounted(() => {
    stop();
  });

  return {
    placeholder: currentPlaceholder,
    animate,
    stop,
  };
}
