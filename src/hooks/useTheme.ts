import { useEffect, useState, useCallback } from "react";
import { validateTheme, getSystemTheme } from "@/lib/utils";
import { THEME_STORAGE_KEY } from "@/lib/constants";

export const useTheme = () => {
  const [theme, setThemeState] = useState<"light" | "dark">("light");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize theme from localStorage or system preference
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    const initialTheme = validateTheme(storedTheme)
      ? storedTheme
      : getSystemTheme();
    setThemeState(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
    setIsReady(true);
  }, []);

  const setTheme = useCallback((nextTheme: "light" | "dark") => {
    setThemeState(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return { theme, setTheme, toggleTheme, isReady };
};
