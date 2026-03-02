import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAFAFA",
        foreground: "#09090b",
        border: "#e4e4e7",
        zinc: {
          950: "#09090b",
        }
      },
      fontFamily: {
        geist: ["Geist", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-.075em",
        tighter: "-.05em",
      }
    },
  },
  plugins: [
    typography,
  ],
}
