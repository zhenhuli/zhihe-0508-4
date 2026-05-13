/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        'yoga-purple': '#6B46C1',
        'yoga-light': '#9F7AEA',
        'yoga-pink': '#ED64A6',
        'yoga-sage': '#48BB78',
      }
    },
  },
  plugins: [],
}
