/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts,scss}'],
  theme: {
    extend: {
      colors: {
        primary: '#4c9a59', // Sage Green
        'primary-light': '#e7f3e9',
        'text-main': '#0d1b10',
        'text-muted': '#4c9a59',
        'background-light': '#f8fcf9',
        'background-dark': '#102213',
        allergen: '#d97706', // Amber-600 for allergens
      },
      fontFamily: {
        display: ['Be Vietnam Pro', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
};
