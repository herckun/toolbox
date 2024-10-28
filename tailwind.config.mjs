/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: [
      {
        dark: {
          primary: "#f8f9fa",
          secondary: "#ff7518",
          accent: "#18ff75",
          neutral: "#252525",
          "base-100": "#121212",
          "base-200": "080808",
          "base-300": "#000",

          "--rounded-box": "0.5rem", // Subtle box rounding
          "--rounded-btn": "1.2rem", // Slightly rounded buttons
          "--rounded-badge": "1rem", // Medium rounding for badges
          "--animation-btn": "0.3s", // Smooth button animation
          "--animation-input": "0.2s", // Quick input animations
          "--btn-focus-scale": "1.05", // Button grows slightly when focused
          "--border-btn": "2px", // Bold button borders
          "--tab-border": "2px", // Thicker tab borders
          "--tab-radius": "0.25rem", // Minimal rounding for tab corners
        },
        light: {
          primary: "#333333", // Dark gray for better readability on light backgrounds
          secondary: "#ff7518", // Richer orange for better contrast
          accent: "#18ff75", // Darker green for a stronger accent
          neutral: "#d9d9d9", // Light gray for background sections with subtle contrast
          "base-100": "#ffffff", // Pure white for the main background
          "base-200": "#f0f0f0", // Soft light gray for secondary backgrounds
          "base-300": "#cccccc", // Medium-light gray for tertiary backgrounds

          "--rounded-box": "0.5rem", // Subtle box rounding
          "--rounded-btn": "1.2rem", // Slightly rounded buttons
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
