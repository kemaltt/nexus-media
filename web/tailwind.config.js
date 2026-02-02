/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7F3DFF",
          hover: "#6b34d9",
          light: "#f3efff",
        },
        background: {
          dark: "#171021",
          light: "#F8F9FA",
        },
        surface: {
          dark: "#251F30",
          light: "#F3F4F6",
        },
        card: {
          dark: "#121214",
          light: "#FFFFFF",
        },
        border: {
          dark: "#333333",
          light: "#E5E7EB",
        },
        text: {
          primary: {
            dark: "#FFFFFF",
            light: "#171021",
          },
          secondary: {
            dark: "#A1A1A1",
            light: "#6B7280",
          },
        },
      },
      borderRadius: {
        lg: "1.25rem",
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
};
