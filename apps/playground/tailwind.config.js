/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/types/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aura: {
          bg1: "#6f86a2",
          bg2: "#8ea1b9",
          text: "#111723",
          muted: "#526074",
          accent: "#5a7aa8",
          accent2: "#3b5d8d",
          sel: "#d8e7fb",
          success: "#2e7d52",
          warn: "#b45309",
          danger: "#b91c1c",
        },
      },
      fontFamily: {
        sans: ['Satoshi', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        aura: "14px",
        "aura-lg": "18px",
        "aura-sm": "10px",
      },
    },
  },
  plugins: [],
};
