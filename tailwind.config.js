/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "ak-black": "#0D0D0D",
        "ak-red": "#CC0000",
        "ak-red-dark": "#8B0000",
        "ak-gray": "#1A1A1A",
        "ak-gray2": "#2D2D2D",
        "ak-gold": "#C9A84C",
        "ak-green": "#2D5A1B",
        "ak-white": "#F0F0F0",
      },
    },
  },
  plugins: [],
};
