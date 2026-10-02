import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cream: {
          50: "#FFFDF9",
          100: "#FAF6ED",
          200: "#F5EFE0",
        },
        kidPurple: {
          light: "#F3EDFF",
          DEFAULT: "#8B5CF6",
          dark: "#6D28D9",
        },
        kidBlue: {
          light: "#EBF3FF",
          DEFAULT: "#3B82F6",
          dark: "#1D4ED8",
        },
        kidGreen: {
          light: "#E8FAF0",
          DEFAULT: "#10B981",
          dark: "#047857",
        },
        kidOrange: {
          light: "#FFF4EB",
          DEFAULT: "#F97316",
          dark: "#C2410C",
        },
        kidPink: {
          light: "#FDF2F8",
          DEFAULT: "#EC4899",
          dark: "#BE185D",
        },
        kidYellow: {
          light: "#FEF9C3",
          DEFAULT: "#F59E0B",
          dark: "#B45309",
        },
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        chunky: "0 6px 0 0 rgba(0, 0, 0, 0.08)",
        "chunky-sm": "0 4px 0 0 rgba(0, 0, 0, 0.08)",
        "chunky-btn": "0 4px 0 0 rgba(0, 0, 0, 0.12)",
        "chunky-active": "0 1px 0 0 rgba(0, 0, 0, 0.12)",
      },
      fontFamily: {
        kids: ['var(--font-outfit)', 'Comic Sans MS', 'ui-rounded', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
