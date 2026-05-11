/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg0: "var(--bg-0)",
        bg1: "var(--bg-1)",
        bg2: "var(--bg-2)",
        fg0: "var(--fg-0)",
        fg1: "var(--fg-1)",
        fg2: "var(--fg-2)",
        accent: "var(--accent)",
        ok: "var(--ok)",
        warn: "var(--warn)",
        err: "var(--err)",
      },
      borderRadius: {
        xl: "var(--radius)",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
