/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#f3f6fb",
        surface: "#ffffff",
        ink: "#0f172a",
        muted: "#64748b",
        primary: "#2563eb"
      }
    }
  },
  plugins: []
};
