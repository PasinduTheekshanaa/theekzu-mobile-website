import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        canvas: "rgb(var(--ui-background) / <alpha-value>)",
        surface: "rgb(var(--ui-surface) / <alpha-value>)",
        elevated: "rgb(var(--ui-elevated) / <alpha-value>)",
        ink: "rgb(var(--ui-foreground) / <alpha-value>)",
        muted: "rgb(var(--ui-muted) / <alpha-value>)",
        line: "rgb(var(--ui-border) / <alpha-value>)",
        action: "rgb(var(--ui-action) / <alpha-value>)",
        "on-action": "rgb(var(--ui-on-action) / <alpha-value>)",
        whatsapp: "rgb(var(--ui-whatsapp) / <alpha-value>)",
        offer: "rgb(var(--ui-offer) / <alpha-value>)",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "'SF Pro Display'",
          "'Segoe UI'",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        "card-hover": "0 16px 40px -10px rgb(0 0 0 / 0.18)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3.5s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.45", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.06)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
