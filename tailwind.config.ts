import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Tavas ecosystem palette
        earth: {
          DEFAULT: "#362417", // Tavas dark brown
          light: "#4a3220",
          soft: "#6b5340",
        },
        gold: {
          DEFAULT: "#F5A623", // Tavas gold
          soft: "#f7bc55",
          deep: "#d98e0f",
        },
        cream: "#faf6f0",
        sand: "#f0e8dc",
      },
      fontFamily: {
        display: ["Georgia", "Cambria", "serif"],
        body: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
