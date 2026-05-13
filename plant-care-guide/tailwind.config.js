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
        'plant-green': '#2D5A27',
        'plant-light': '#4A7C59',
        'soil': '#8B6914',
        'leaf': '#7CB342',
      }
    },
  },
  plugins: [],
}
