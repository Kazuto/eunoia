import { ref, onMounted, onUnmounted } from "vue";

/**
 * Creates an animated typing placeholder that cycles through multiple strings.
 *
 * @param placeholders - Array of strings to cycle through
 * @param options - Configuration options for typing animation
 * @returns A reactive ref containing the current animated placeholder text
 *
 * @example
 * ```vue
 * <script setup>
 * const placeholder = useTypingPlaceholder(
 *   ['John Doe', 'Jane Smith', 'Alex Johnson'],
 *   { typingSpeed: 100, deletingSpeed: 50, pauseDuration: 2000 }
 * );
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
  } = {}
) {
  const {
    typingSpeed = 100,
    deletingSpeed = 50,
    pauseDuration = 2000,
  } = options;

  const currentPlaceholder = ref("");
  const currentIndex = ref(0);
  const isDeleting = ref(false);
  const charIndex = ref(0);

  let timeoutId: NodeJS.Timeout;

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

  onMounted(() => {
    animate();
  });

  onUnmounted(() => {
    clearTimeout(timeoutId);
  });

  return currentPlaceholder;
}
