/**
 * CF360 design tokens — the single source of truth.
 * Mirrors the Figma "Design Tokens & Style Guide" frame.
 * Never hardcode a hex/size anywhere else; import from here (or use the
 * Tailwind classes generated from these values in tailwind.config.ts).
 */

export const colors = {
  primary: "#2563EB",
  "primary-soft": "#EFF4FF",

  text: "#111827",
  "text-sub": "#4B5563", // 7.6:1 on white
  "text-faint": "#6B7280", // 4.8:1 on white, the lightest allowed for text

  border: "#E5E7EB",
  line: "#EEF0F2",

  bg: "#F9FAFB",
  surface: "#FFFFFF",

  // Status colours: the base is for fills, icons and borders; the -ink shade
  // is for text on the -soft tint (the base fails 4.5:1 there).
  success: "#10B981",
  "success-soft": "#E7F7F0",
  "success-ink": "#047857",
  warning: "#F59E0B",
  "warning-soft": "#FEF6E7",
  "warning-ink": "#B45309",
  danger: "#EF4444",
  "danger-soft": "#FDECEC",
  "danger-ink": "#B91C1C",
} as const;

/**
 * One-hue scale for charts, darkest first. Ranked data reads by length and
 * position, so colour only separates parts of a whole (the language donut).
 */
export const chartBlues = ["#2563EB", "#4F83EE", "#7FA4F2", "#A9C2F6", "#C9D8FA"] as const;

/** Type scale — Inter, even sizes, line-heights on the 8px grid. */
export const typography = {
  display: { size: 24, lineHeight: 32, weight: 700 },
  title: { size: 20, lineHeight: 24, weight: 700 },
  heading: { size: 16, lineHeight: 24, weight: 600 },
  label: { size: 14, lineHeight: 16, weight: 500 },
  body: { size: 14, lineHeight: 16, weight: 400 },
  "body-relaxed": { size: 14, lineHeight: 20, weight: 400 },
  caption: { size: 12, lineHeight: 16, weight: 400 },
} as const;

/** 8px grid; 4 allowed as a half-step. */
export const spacing = [4, 8, 16, 24, 32] as const;

export const radius = {
  control: 8, // buttons, inputs
  card: 10,
  pill: 999,
} as const;

export const sizing = {
  controlHeight: 40,
  topBar: 56,
  sideNav: 240,
  contentColumn: 720,
} as const;

export type ColorToken = keyof typeof colors;
