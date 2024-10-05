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
      'xsm': {'max': '374px'}
    },
    extend: {
      zIndex:{
        '99':'99'
      },
      boxShadow: {
        'dark-lg': '0 10px 10px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.5)',
      },
      variables: {
        '--yTranslate': 'calc(100% - (100% - 30px)/4)',
        '--legalCircle': 'calc(100%*0.29 + 0px)'
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)'},
          '100%': { transform: 'translateX(0%)' },
        },
        fillToFull: {
          '0%': {width: '0%'},
          '100%': {width: '100%'}
        }
      },
      animation: {
        slideIn: 'slideIn 0.5s ease-out',
        fillToFull: 'fillToFull 5s linear forwards',
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