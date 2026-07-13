/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Instrument-panel palette — pale cool ground, deep ink chrome, three
        // signal colors that each mean something specific in this product:
        // gold = awaiting review, teal = trusted/verified, rose = escalated.
        bg: "#EEF1F4",
        surface: "#FFFFFF",
        ink: {
          900: "#12202E",
          700: "#1E3245",
          600: "#46586B",
          400: "#7C8CA0",
        },
        line: "#DBE1E8",
        gold: { DEFAULT: "#C08A2E", 100: "#F6E9D2", 700: "#8A6220" },
        teal: { DEFAULT: "#2E8C82", 100: "#DCEEEC", 700: "#1F615A" },
        rose: { DEFAULT: "#C4485A", 100: "#F5DCE0", 700: "#8E3242" },
        violet: { DEFAULT: "#6B5CA5", 100: "#E7E3F3", 700: "#4C4079" },
      },
      fontFamily: {
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        sans: ["'IBM Plex Sans'", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        panel: "0 1px 2px rgba(18,32,46,0.04), 0 8px 24px -12px rgba(18,32,46,0.12)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
