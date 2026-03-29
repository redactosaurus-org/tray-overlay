import { useEffect, useState } from "react";
import { getSystemTheme } from "@/lib/utils";

export const useTheme = () => {
  const [theme, setThemeState] = useState<"light" | "dark">("light");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize theme from system preference
    const systemTheme = getSystemTheme();
    setThemeState(systemTheme);
    document.documentElement.setAttribute("data-theme", systemTheme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? "dark" : "light";
      setThemeState(newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
    };

    mediaQuery.addEventListener("change", handleChange);
    setIsReady(true);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return { theme, isReady };
};
