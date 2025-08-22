import React from "react";
import { useTheme } from "../theme/ThemeProvider.jsx";

function prettyLabel(theme, resolved) {
  if (theme === "system") return `Oscuro (system)`;       // se mostrará cuando el sistema esté en oscuro
  return theme === "dark" ? "Oscuro" : "Claro";
}

function next(theme) {
  // light → dark → system → light
  if (theme === "light") return "dark";
  if (theme === "dark") return "system";
  return "light";
}

function ThemeToggleButton({ className = "", full = false }) {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(next(theme))}
      title="Cambiar tema (light/dark/system)"
      className={
        "px-3 py-2 rounded-lg border text-sm bg-white/80 dark:bg-slate-800/70 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/80 " +
        className
      }
    >
      {full ? `Tema: ${prettyLabel(theme, resolvedTheme)}` : prettyLabel(theme, resolvedTheme)}
    </button>
  );
}

export default ThemeToggleButton;
