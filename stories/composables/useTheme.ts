import { ref, computed, watch, onMounted } from "vue";

type Theme = "light" | "dark" | "system";

const MODES = ["light", "dark", "system"] as const;

const STORAGE_KEY = "theme";

const theme = ref<Theme>("system");
const systemPrefersDark = ref(false);

export function useTheme() {
  function getStoredTheme(): Theme | null {
    if (typeof window === "undefined") return null;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }

    return null;
  }

  function storeTheme(value: Theme) {
    if (typeof window === "undefined") return;

    localStorage.setItem(STORAGE_KEY, value);

    // Optional cookie (useful for SSR)
    document.cookie = `theme=${value}; path=/; max-age=31536000`;
  }

  function applyTheme() {
    if (typeof window === "undefined") return;

    const dark =
      theme.value === "dark" ||
      (theme.value === "system" && systemPrefersDark.value);

    document.documentElement.classList.toggle("dark", dark);
  }

  function setTheme(value: Theme) {
    theme.value = value;
    storeTheme(value);
  }

  function toggleTheme() {
    setTheme(isDark.value ? "light" : "dark");
  }

  function cycleTheme() {
    const currentIndex = MODES.indexOf(theme.value);
    const nextMode = MODES[(currentIndex + 1) % MODES.length];

    setTheme(nextMode);
  }

  const nextTheme = computed(() => {
    const nextIndex = MODES.indexOf(theme.value) + 1;

    return MODES[nextIndex % MODES.length];
  });

  const isDark = computed(() => {
    return (
      theme.value === "dark" ||
      (theme.value === "system" && systemPrefersDark.value)
    );
  });

  onMounted(() => {
    if (typeof window === "undefined") return;

    // Restore saved theme
    const saved = getStoredTheme();
    if (saved) theme.value = saved;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    systemPrefersDark.value = media.matches;

    media.addEventListener("change", (e) => {
      systemPrefersDark.value = e.matches;
    });

    applyTheme();
  });

  watch([theme, systemPrefersDark], applyTheme);

  return {
    theme,
    nextTheme,
    isDark,
    setTheme,
    cycleTheme,
    toggleTheme,
  };
}
