/** @jsxImportSource preact */

import type { FunctionalComponent } from "preact";
import { useEffect, useState } from "preact/hooks";
import { applyTheme, resolveTheme, storeTheme, type Theme } from "../../utils/theme";

const SunIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

const MoonIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true">
    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
  </svg>
);

/** 밝은/어두운 테마를 오가는 버튼. 지금이 어두우면 해를, 밝으면 달을 보여 준다. */
const ThemeToggle: FunctionalComponent = () => {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(resolveTheme());
  }, []);

  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      class="icon-button"
      aria-label={next === "dark" ? "어두운 테마로 바꾸기" : "밝은 테마로 바꾸기"}
      title={next === "dark" ? "어두운 테마" : "밝은 테마"}
      onClick={() => {
        storeTheme(next);
        applyTheme(next);
        setTheme(next);
      }}
    >
      {theme === "dark" ? SunIcon : MoonIcon}
    </button>
  );
};

export default ThemeToggle;
