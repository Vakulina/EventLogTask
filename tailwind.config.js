/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': {
        'max': '750px'
      },
      'xxs': {
        'max': '660px'
      },
    },

    fontSize: {
      xs: '0.7rem',
    }

  },
  plugins: [],
}

