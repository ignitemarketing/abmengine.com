/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      colors: {
        ink:    { 950: '#06060C', 900: '#0B0B14', 800: '#14141F', 700: '#1F1F2E', 600: '#2C2C40' },
        violet: { 300: '#C4B5FD', 400: '#A78BFA', 500: '#8B5CF6', 600: '#7C3AED', 700: '#6D28D9' },
        cyber:  { 400: '#22D3EE', 500: '#06B6D4' },
        bone:   { 50: '#F8F8FB', 100: '#E8E8F0', 200: '#C8C8D6' }
      }
    }
  }
}
