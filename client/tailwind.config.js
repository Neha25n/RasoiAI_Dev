/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', "ui-serif", "Georgia", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card:     { DEFAULT: "var(--card)",    foreground: "var(--card-foreground)" },
        surface:  { DEFAULT: "var(--surface)", foreground: "var(--surface-foreground)" },
        primary:  { DEFAULT: "var(--primary)", foreground: "var(--primary-foreground)" },
        muted:    { DEFAULT: "var(--muted)",   foreground: "var(--muted-foreground)" },
        border:   "var(--border)",
        input:    "var(--input)",
        ring:     "var(--ring)",
        have:     "var(--have)",
        sub:      "var(--sub)",
        buy:      "var(--buy)",
      },
      borderRadius: {
        xl:  "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        glow: "var(--shadow-glow)",
      },
    },
  },
  plugins: [],
};
