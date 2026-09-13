import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090b",
        surface: "#121215",
        "surface-hover": "#1a1a20",
        brand: {
          DEFAULT: "#E50914",
          hover: "#f40612",
          dark: "#b20710",
          glow: "rgba(229, 9, 20, 0.4)",
        },
        gold: {
          400: "#FBBF24",
          500: "#F59E0B",
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient": "linear-gradient(to top, #09090b 0%, rgba(9,9,11,0.7) 40%, rgba(9,9,11,0.2) 100%)",
        "hero-gradient-left": "linear-gradient(to right, #09090b 15%, rgba(9,9,11,0.85) 40%, rgba(9,9,11,0) 85%)",
        "card-gradient": "linear-gradient(to top, rgba(9,9,11,0.95) 0%, rgba(9,9,11,0.4) 50%, rgba(9,9,11,0) 100%)",
      },
      animation: {
        "pulse-glow": "pulseGlow 2.5s infinite ease-in-out",
        "fade-in": "fadeIn 0.3s ease-out forwards",
        "slide-up": "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "shimmer": "shimmer 2s infinite linear",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 15px rgba(229, 9, 20, 0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(229, 9, 20, 0.7)" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "scale(0.98)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        }
      },
    },
  },
  plugins: [],
};

export default config;
