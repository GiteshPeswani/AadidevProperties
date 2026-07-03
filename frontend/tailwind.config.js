/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F172A',
        secondary: '#2563EB',
        accent: '#F59E0B',
        neutralBg: '#F8FAFC'
      }
    },
  },
  plugins: [],
}
