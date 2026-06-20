/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        cream: '#F7F5F2',
        umber: '#3D352E',
        terra: '#C67B5C',
        moss: '#7A8B6E',
        slateblue: '#6B7D8C',
        warmgray: '#A9A099',
      },
      fontFamily: {
        display: ['"LXGW WenKai"', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
        body: ['"Source Han Serif SC"', '"Songti SC"', '"SimSun"', 'serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.4s ease-out forwards',
        'draw-line': 'drawLine 1s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        drawLine: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
      },
    },
  },
  plugins: [],
};
