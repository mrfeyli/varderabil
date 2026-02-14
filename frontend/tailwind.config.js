/** @type {import('tailwindcss').Config} */
export default {
  // Vilka filer Tailwind ska scanna efter klasser
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  // Anpassa färger/storlekar här vid behov
  theme: {
    extend: {},
  },

  plugins: [],
}