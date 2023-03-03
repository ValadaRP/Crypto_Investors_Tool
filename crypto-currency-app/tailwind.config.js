/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
        display: ['Pally', 'Comic Sans MS', 'sans-serif'],
        body: ['Pally', 'Comic Sans MS', 'sans-serif'],
    },
    extend: {
      height: {
        '128': '32rem',
        '192': '48rem',
      },
    },
    screens: {
        'esm': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        'mf': '1024px',
    },
  },
  plugins: [
      require('@tailwindcss/forms'),
      require('@tailwindcss/typography'),
  ],
}
