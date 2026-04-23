/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          600: '#7C5DFA',
          700: '#6B4DB5',
        },
        gray: {
          100: '#F8F8FB',
          600: '#888EB0',
          700: '#373B53',
          900: '#0F0F1E',
        },
      },
    },
  },
  plugins: [],
}
