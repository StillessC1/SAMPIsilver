import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Cormorant Garamond", "Georgia", "serif"],
        display: ["Playfair Display", "Georgia", "serif"],
      },
      colors: {
        silver: {
          50: "#f8f9fa",
          100: "#e9ecef",
          200: "#dee2e6",
          300: "#adb5bd",
          400: "#6c757d",
          500: "#495057",
          600: "#343a40",
          700: "#212529",
        },
      },
    },
  },
  plugins: [],
};
export default config;
