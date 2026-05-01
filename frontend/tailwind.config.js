/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        viva: {
          saffron: '#d97706',
          maroon: '#8a1538',
          leaf: '#256d5a',
          ink: '#172026',
          mist: '#f5f7f4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 16px 40px rgba(23, 32, 38, 0.08)',
      },
    },
  },
  plugins: [],
};
