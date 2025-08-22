import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeCtx = createContext(null);

export function ThemeProvider({ children, defaultTheme = "system" }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || defaultTheme);
  const mq = useMemo(() => window.matchMedia("(prefers-color-scheme: dark)"), []);
  const [systemDark, setSystemDark] = useState(mq.matches);

  useEffect(() => {
    const onChange = (e) => setSystemDark(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mq]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    const effective = theme === "system" ? (systemDark ? "dark" : "light") : theme;
    document.documentElement.classList.toggle("dark", effective === "dark");
    document.documentElement.setAttribute("data-theme", effective);
  }, [theme, systemDark]);

  const value = useMemo(
    () => ({
      theme,                                   // "light" | "dark" | "system"
      resolvedTheme: theme === "system" ? (systemDark ? "dark" : "light") : theme,
      setTheme,
    }),
    [theme, systemDark]
  );

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
