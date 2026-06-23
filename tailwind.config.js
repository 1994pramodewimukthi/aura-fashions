/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: '#F1ECE2',
        bone: '#111110',
        clay: '#B6502E',
        moss: '#4B5A3F',
        steel: '#8A8579'
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        accent: ['var(--font-accent)']
      },
      letterSpacing: {
        widest2: '0.25em'
      }
    }
  },
  plugins: []
};
