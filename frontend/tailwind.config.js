/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#15202B",
        brand: "#2563EB",
        mint: "#0F766E"
      },
      boxShadow: {
        soft: "0 16px 40px rgba(21, 32, 43, 0.08)"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.98)" },
          "100%": { opacity: "1", transform: "scale(1)" }
        }
      },
      animation: {
        "fade-up": "fade-up 420ms ease-out both",
        "scale-in": "scale-in 180ms ease-out both"
      }
    }
  },
  plugins: []
};
