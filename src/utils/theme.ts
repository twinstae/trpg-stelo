/**
 * Shared light/dark theme handling.
 *
 * The same logic is used by three places, so it lives here to keep them in sync:
 * - the pre-render `<script is:inline>` in `HeadCommon.astro` (avoids FOUC)
 * - the Preact toggle in `RightSidebar/ThemeToggleButton.tsx`
 *
 * daisyUI v5 only emits CSS for the themes listed in `src/styles/index.css`, so
 * the values in `DAISY_THEMES` must match that list or the toggle silently does
 * nothing.
 */

export type Theme = "light" | "dark";

export const STORAGE_KEY = "theme";

/** daisyUI themes from `src/styles/index.css` applied via `<html data-theme="…">`. */
export const DAISY_THEMES: Record<Theme, string> = {
  light: "emerald",
  dark: "forest",
};

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

export function getStoredTheme(): Theme | undefined {
  if (typeof localStorage === "undefined") return undefined;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isTheme(stored) ? stored : undefined;
  } catch {
    // Storage can be unavailable (private mode, blocked cookies).
    return undefined;
  }
}

/** Stored preference first, otherwise the OS color scheme. */
export function resolveTheme(): Theme {
  const stored = getStoredTheme();
  if (stored) return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function storeTheme(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Keep the in-memory theme when storage is unavailable.
  }
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("theme-dark", theme === "dark");
  root.setAttribute("data-theme", DAISY_THEMES[theme]);
}
