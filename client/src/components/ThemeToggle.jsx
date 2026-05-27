import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

const KEY = "rasoiai-theme";

function applyTheme(t) {
  const root = document.documentElement;
  root.classList.add("theme-transition");
  t === "dim" ? root.classList.add("dark") : root.classList.remove("dark");
  setTimeout(() => root.classList.remove("theme-transition"), 500);
}

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      const s = localStorage.getItem(KEY);
      if (s === "light" || s === "dim") return s;
    } catch {}
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dim" : "light";
  });

  useEffect(() => { applyTheme(theme); }, [theme]);

  const toggle = () => {
    const next = theme === "light" ? "dim" : "light";
    setTheme(next);
    try { localStorage.setItem(KEY, next); } catch {}
  };

  return { theme, toggle };
}

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDim = theme === "dim";
  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${isDim ? "light" : "dim"} mode`}
      className="w-9 h-9 rounded-full border border-[var(--border)] bg-[var(--surface)] grid place-items-center hover:border-[var(--primary)] transition-colors"
    >
      {isDim
        ? <Sun className="w-4 h-4 text-[var(--primary)]" />
        : <Moon className="w-4 h-4 text-[var(--primary)]" />}
    </button>
  );
}
