import { type Config } from 'tailwindcss'

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'news-gothic-condensed-bold': ['"News Gothic Condensed Bold"', 'sans-serif'],
        'inter': ['"Inter"', 'sans-serif']
      },
    },
  },
  plugins: [],
} satisfies Config
