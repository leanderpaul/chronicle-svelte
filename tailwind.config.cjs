/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        paper: {
          light: '#292929',
          DEFAULT: '#1e1e1e',
          dark: '#121212',
        },
        content: {
          light: '#ffffffde',
          DEFAULT: '#8a8a8a',
          dark: '#6a6a6a',
        },
      },
    },
  },
  plugins: [require('flowbite/plugin')],
  darkMode: 'class',
};

module.exports = config;
