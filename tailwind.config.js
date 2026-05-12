/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1B4332',
          dark: '#0f291f',
          light: '#2d6a4f',
          soft: '#D8EDE4',
          muted: '#EEF3F1',
          surface: '#F6F8F7',
          beige: '#EDE5D8',
          'beige-deep': '#D4C4B0',
        },
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
