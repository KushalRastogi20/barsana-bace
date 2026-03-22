import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#3a2e1a",
          light:   "#6b5535",
          muted:   "#8a7055",
        },
        gold: {
          DEFAULT: "#e8a900",
          light:   "#f5c842",
          dark:    "#b07d00",
          deep:    "#7a5500",
        },
        cream: {
          DEFAULT: "#fdf6e3",
          dark:    "#f0e4c0",
        },
        parchment: "#f5d878",
      },
      fontFamily: {
        cinzel:     ["Cinzel Decorative", "serif"],
        "cinzel-reg": ["Cinzel", "serif"],
        cormorant:  ["Cormorant Garamond", "serif"],
        fell:       ["IM Fell English", "serif"],
        devanagari: ["Noto Serif Devanagari", "serif"],
      },
      animation: {
        float:    "float 5s ease-in-out infinite",
        shimmer:  "shimmer 3.5s linear infinite",
        mantra:   "mantraPulse 4s ease-in-out infinite",
        "fade-up":"fadeInUp 0.65s ease-out forwards",
        petal:    "petalFall linear infinite",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%":     { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "200% center" },
          "100%": { backgroundPosition: "-200% center" },
        },
        mantraPulse: {
          "0%,100%": { opacity: "0.6", letterSpacing: "0.04em" },
          "50%":     { opacity: "1",   letterSpacing: "0.10em" },
        },
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        petalFall: {
          "0%":   { transform: "translateY(-5vh) rotate(0deg)",    opacity: "0" },
          "8%":   {                                                  opacity: "0.7" },
          "90%":  {                                                  opacity: "0.3" },
          "100%": { transform: "translateY(105vh) rotate(540deg)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
