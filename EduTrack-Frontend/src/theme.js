// ── EduTrack Theme System ──────────────────────────────────
// Supports Dark (night) and Light (day) themes

export const DARK = {
  bg:        "#0d1117",
  surface:   "#161b25",
  surface2:  "#1e2535",
  surface3:  "#242d3d",
  border:    "rgba(255,255,255,0.06)",
  gold:      "#e8b96a",
  goldDim:   "rgba(232,185,106,0.12)",
  goldMid:   "rgba(232,185,106,0.3)",
  teal:      "#4ecdc4",
  tealDim:   "rgba(78,205,196,0.1)",
  rose:      "#f87171",
  roseDim:   "rgba(248,113,113,0.1)",
  purple:    "#a78bfa",
  purpleDim: "rgba(167,139,250,0.1)",
  blue:      "#60a5fa",
  blueDim:   "rgba(96,165,250,0.1)",
  green:     "#34d399",
  greenDim:  "rgba(52,211,153,0.1)",
  text:      "#e8e6e1",
  textMuted: "#7a8099",
  textDim:   "#4a5068",
};

export const LIGHT = {
  bg:        "#f5f3ef",
  surface:   "#ffffff",
  surface2:  "#f0ede8",
  surface3:  "#e8e4de",
  border:    "rgba(0,0,0,0.08)",
  gold:      "#b8860b",
  goldDim:   "rgba(184,134,11,0.1)",
  goldMid:   "rgba(184,134,11,0.3)",
  teal:      "#0d9488",
  tealDim:   "rgba(13,148,136,0.1)",
  rose:      "#dc2626",
  roseDim:   "rgba(220,38,38,0.08)",
  purple:    "#7c3aed",
  purpleDim: "rgba(124,58,237,0.08)",
  blue:      "#2563eb",
  blueDim:   "rgba(37,99,235,0.08)",
  green:     "#059669",
  greenDim:  "rgba(5,150,105,0.08)",
  text:      "#1a1a2e",
  textMuted: "#4a5568",
  textDim:   "#9aa0ab",
};

export const font = "'Playfair Display', serif";
export const body = "'DM Sans', sans-serif";
export const mono = "'DM Mono', monospace";

export const FONTS_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');`;

// Default — dark theme
export const C = DARK;