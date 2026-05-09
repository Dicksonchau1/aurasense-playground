// Tailwind CSS config for Playground v1 design tokens
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#050508',
        surface: '#0a0d14',
        border: 'rgba(255,255,255,0.08)',
        primary: '#00d4ff',
        warning: '#f59e0b',
        success: '#10b981',
        mono: {
          DEFAULT: '#e5e7eb',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
