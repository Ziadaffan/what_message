/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        whatsapp: {
          light: '#25D366',
          dark: '#075E54',
          teal: '#128C7E',
          bg: '#ece5dd',
          chat: '#e5ddd5',
          bubble: '#dcf8c6'
        }
      }
    },
  },
  plugins: [],
}
