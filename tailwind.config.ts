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
        brand: {
          black: "#040711",
          dark: "#070c18",
          charcoal: "#0b1326",
          surface: "#0f1a36",
          card: "rgba(15, 23, 42, 0.7)",
          border: "rgba(0, 210, 255, 0.15)",
          blue: "#0066ff",
          electric: "#0070f3",
          neon: "#00d2ff",
          cyan: "#00f0ff",
          purple: "#8b5cf6",
          indigo: "#6366f1",
          silver: "#cbd5e1",
          titanium: "#94a3b8",
        },
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
        "neon-blue": "0 0 25px -3px rgba(0, 102, 255, 0.4)",
        "neon-cyan": "0 0 25px -3px rgba(0, 210, 255, 0.4)",
        "neon-glow": "0 0 35px 2px rgba(0, 180, 255, 0.25)",
        "card-hover": "0 16px 40px -10px rgba(0, 102, 255, 0.3)",
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
