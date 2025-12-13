/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'coca-cola-red': '#F40009',
        'coca-cola-dark': '#1E1E1E',
      },
      fontFamily: {
        sans: ['var(--font-vazirmatn)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

