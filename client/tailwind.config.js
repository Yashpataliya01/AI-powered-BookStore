/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['DM Sans', 'sans-serif'],
        serif:   ['Playfair Display', 'Georgia', 'serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      transitionDuration: {
        '400': '400ms',
        '1200': '1200ms',
        '1400': '1400ms',
      },
      scale: {
        '107': '1.07',
      },
    },
  },
  plugins: [],
}
