import { createContext, useContext, useState, useEffect } from "react";
import { DARK, LIGHT } from "../theme";

// ── Theme Context ─────────────────────────────────────────
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Load saved theme from localStorage (persists after page reload)
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("edutrack-theme");
    return saved ? saved === "dark" : true; // default dark
  });

  const theme = isDark ? DARK : LIGHT;

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      localStorage.setItem("edutrack-theme", next ? "dark" : "light");
      return next;
    });
  };

  // Apply theme to body background
  useEffect(() => {
    document.body.style.background = theme.bg;
    document.body.style.color = theme.text;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ── Hook to use theme anywhere ────────────────────────────
export function useTheme() {
  return useContext(ThemeContext);
}
