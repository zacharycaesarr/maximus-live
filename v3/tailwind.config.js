/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FCFAF2',
        'warm-cream': '#F5F0E6',
        tan: '#D9C3B0',
        mocha: '#8B6950',
        espresso: '#2C2520',
      },
      fontFamily: {
        nhg: ['"Neue Haas Grotesk Display"', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        tiempos: ['"Tiempos Headline"', 'Georgia', 'Times New Roman', 'serif'],
        druk: ['"Druk Condensed"', 'Druk', 'Impact', 'sans-serif'],
        'druk-wide': ['"Druk Wide"', 'Druk', 'Impact', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
