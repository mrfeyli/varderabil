/** @type {import('tailwindcss').Config} */
export default {
  // Vilka filer Tailwind ska scanna efter klasser
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  // Anpassa färger här
  theme: {
    extend: {
      colors: {
        // VärderaBil färgschema
        primary: '#1B3A5C',      // Mörkblå - huvudfärg
        teal: '#0F7B79',         // Teal - miljövänlig accent
        'light-blue': '#D6E8F7', // Ljusblå - bakgrunder
        accent: '#1A6B3A',       // Grön - CTA-knappar
      },
    },
  },

  plugins: [],
}