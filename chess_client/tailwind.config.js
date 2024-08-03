/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      '2xl': { 'max': '1535px' },
      'xl': { 'max': '1279px' },
      'lg': { 'max': '1023px' },
      'md': { 'max': '767px' },
      'sm': { 'max': '639px' },
    },
    extend: {
      boxShadow: {
        'dark-lg': '0 10px 10px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.5)',
      },
      variables: {
        '--chessboard-size': '470px',
        '--cell-size': 'calc(var(--chessboard-size) / 8)',
        '--yTranslate': 'calc(var(--cell-size)*3 + 30px)',
        '--legalCircle': 'calc(var(--cell-size)*0.29 + 0px)'
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    function ({ addBase, theme }) {
      addBase({
        ':root': theme('variables'),
      });
    },
  ],
};