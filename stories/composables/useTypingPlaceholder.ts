import { ref, type Ref, onMounted, onUnmounted } from "vue";

/**
 * Creates an animated typing placeholder that cycles through multiple strings.
 *
 * @param placeholders - Array of strings to cycle through
 * @param options - Configuration options for typing animation
 * @returns An object with the placeholder ref, animate function, and stop function
 *
 * @example
 * ```vue
 * <script setup>
 * // Auto-start animation (default behavior)
 * const { placeholder } = useTypingPlaceholder(['John Doe', 'Jane Smith', 'Alex Johnson']);
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
  placeholders: string[],
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

  let timeoutId: NodeJS.Timeout | undefined;

  const animate = () => {
    const fullText = placeholders[currentIndex.value];

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
        currentIndex.value = (currentIndex.value + 1) % placeholders.length;
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
