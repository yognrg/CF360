import type { Config } from "tailwindcss";

/**
 * Tailwind theme is derived from src/tokens.ts. Colors/type/spacing/radii are
 * defined ONCE here so no stray hex values live in components.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#2563EB", soft: "#EFF4FF" },
        text: { DEFAULT: "#111827", sub: "#4B5563", faint: "#6B7280" },
        border: { DEFAULT: "#E5E7EB" },
        line: "#EEF0F2",
        bg: "#F9FAFB",
        surface: "#FFFFFF",
        success: { DEFAULT: "#10B981", soft: "#E7F7F0", ink: "#047857" },
        warning: { DEFAULT: "#F59E0B", soft: "#FEF6E7", ink: "#B45309" },
        danger: { DEFAULT: "#EF4444", soft: "#FDECEC", ink: "#B91C1C" },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        display: ["24px", { lineHeight: "32px", fontWeight: "700" }],
        title: ["20px", { lineHeight: "24px", fontWeight: "700" }],
        heading: ["16px", { lineHeight: "24px", fontWeight: "600" }],
        label: ["14px", { lineHeight: "16px", fontWeight: "500" }],
        body: ["14px", { lineHeight: "16px", fontWeight: "400" }],
        "body-relaxed": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        caption: ["12px", { lineHeight: "16px", fontWeight: "400" }],
      },
      spacing: {
        1: "4px",
        2: "8px",
        4: "16px",
        6: "24px",
        8: "32px",
      },
      borderRadius: {
        control: "8px",
        card: "10px",
        pill: "999px",
      },
      height: {
        control: "40px",
        topbar: "56px",
      },
      width: {
        sidenav: "240px",
        content: "720px",
      },
      maxWidth: {
        content: "720px",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(17, 24, 39, 0.05)",
        drawer: "-8px 0 24px 0 rgba(17, 24, 39, 0.08)",
        toast: "0 8px 24px 0 rgba(17, 24, 39, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
