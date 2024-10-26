/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        main: {
          primary: "#f8f9fa",
          secondary: "#ff7518",
          accent: "#18ff75",
          neutral: "#4a4a4a",
          "base-100": "#141414",

          "--rounded-box": "1.5rem", // Subtle box rounding
          "--rounded-btn": "0.75rem", // Slightly rounded buttons
          "--rounded-badge": "1rem", // Medium rounding for badges
          "--animation-btn": "0.3s", // Smooth button animation
          "--animation-input": "0.2s", // Quick input animations
          "--btn-focus-scale": "1.05", // Button grows slightly when focused
          "--border-btn": "2px", // Bold button borders
          "--tab-border": "2px", // Thicker tab borders
          "--tab-radius": "0.25rem", // Minimal rounding for tab corners
        },
      },
    ],
  },
};
