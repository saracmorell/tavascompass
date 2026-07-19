import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Tavas ecosystem palette — dark luxe
        night: "#1A100A",
        espresso: "#241812",
        earth: {
          DEFAULT: "#362417",
          light: "#4a3220",
          soft: "#6b5340",
        },
        gold: {
          DEFAULT: "#F5A623",
          soft: "#f7bc55",
          deep: "#d98e0f",
        },
        cream: "#faf6f0",
        sand: "#f0e8dc",
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      letterSpacing: {
        luxe: "0.18em",
      },
    },
  },
  plugins: [],
} satisfies Config;
