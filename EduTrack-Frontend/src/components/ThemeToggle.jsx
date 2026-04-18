import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { isDark, toggleTheme, theme: C } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        border: `1px solid ${C.border}`,
        background: C.surface2,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        outline: "none",
        transition: "background 0.2s, border-color 0.2s, transform 0.15s",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08)"; e.currentTarget.style.borderColor = C.gold + "60"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = C.border; }}
    >
      {/* Sun icon */}
      <svg
        key={isDark ? "moon" : "sun"}
        width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke={isDark ? C.gold : "#f59e0b"}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ position: "absolute", transition: "opacity 0.25s, transform 0.3s", opacity: isDark ? 0 : 1, transform: isDark ? "rotate(-90deg) scale(0.6)" : "rotate(0deg) scale(1)" }}
      >
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>

      {/* Moon icon */}
      <svg
        width="15" height="15" viewBox="0 0 24 24"
        fill="none" stroke={C.gold}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ position: "absolute", transition: "opacity 0.25s, transform 0.3s", opacity: isDark ? 1 : 0, transform: isDark ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0.6)" }}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    </button>
  );
}
