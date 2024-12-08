/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'dashboard-dark': '#1a1b23',
        'card-dark': '#24252d',
        'accent-purple': '#8b5cf6',
        'accent-cyan': '#22d3ee',
        'text-primary': '#ffffff',
        'text-secondary': '#9ca3af',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
};