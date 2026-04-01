import { useTheme } from "./ThemeContext";

export default function ThemeToggle() {
  const { isDark, toggleTheme, theme: C } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      style={{
        width: 52,
        height: 28,
        borderRadius: 14,
        border: `1px solid ${C.border}`,
        background: isDark ? C.surface2 : C.surface3,
        cursor: "pointer",
        padding: 3,
        position: "relative",
        transition: "background 0.3s, border 0.3s",
        flexShrink: 0,
        outline: "none",
      }}
    >
      {/* Icons — sun on right, moon on left, always visible but faded */}
      <span style={{
        position: "absolute", left: 6, top: "50%", transform: "translateY(-50%)",
        fontSize: 11, opacity: isDark ? 1 : 0.25, transition: "opacity 0.3s", lineHeight: 1,
      }}>🌙</span>
      <span style={{
        position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)",
        fontSize: 11, opacity: isDark ? 0.25 : 1, transition: "opacity 0.3s", lineHeight: 1,
      }}>☀️</span>

      {/* Sliding knob */}
      <div style={{
        width: 20,
        height: 20,
        borderRadius: "50%",
        background: isDark
          ? `linear-gradient(135deg, ${C.gold}, #c4973a)`
          : `linear-gradient(135deg, #fbbf24, #f59e0b)`,
        position: "absolute",
        top: 3,
        left: isDark ? 3 : 27,
        transition: "left 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s",
        boxShadow: isDark
          ? `0 1px 6px rgba(232,185,106,0.5)`
          : `0 1px 6px rgba(245,158,11,0.4)`,
      }}/>
    </button>
  );
}
