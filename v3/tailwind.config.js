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
        /* Homepage semantic theme — only meaningful under #home-page.
           Use rgb(channel / <alpha>) so /40 opacity utilities resolve. */
        home: {
          'bg-light': 'rgb(var(--home-bg-light-rgb) / <alpha-value>)',
          'bg-dark': 'rgb(var(--home-bg-dark-rgb) / <alpha-value>)',
          'surface-light': 'rgb(var(--home-surface-light-rgb) / <alpha-value>)',
          'surface-dark': 'rgb(var(--home-surface-dark-rgb) / <alpha-value>)',
          'on-light': 'rgb(var(--home-text-light-rgb) / <alpha-value>)',
          'on-dark': 'rgb(var(--home-text-dark-rgb) / <alpha-value>)',
          muted: 'rgb(var(--home-muted-rgb) / <alpha-value>)',
          line: 'rgb(var(--home-line-rgb) / <alpha-value>)',
          acid: 'rgb(var(--home-acid-rgb) / <alpha-value>)',
        },
      },
      fontFamily: {
        nhg: ['"Neue Haas Grotesk Display"', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        tiempos: ['"Tiempos Headline"', 'Georgia', 'Times New Roman', 'serif'],
        switzer: ['Switzer', '"Neue Haas Grotesk Display"', 'Helvetica Neue', 'sans-serif'],
        druk: ['"Druk Condensed"', 'Druk', 'Impact', 'sans-serif'],
        'druk-wide': ['"Druk Wide"', 'Druk', 'Impact', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
