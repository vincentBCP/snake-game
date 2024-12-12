/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "back-to-front": {
          "0%": {
            opacity: 0,
            transform: "scale(0.5)",
          },
          "100%": {
            opacity: 1,
            transform: "scale(1)",
          },
        },
      },
      animation: {
        backtofront: "back-to-front 200ms linear",
      },
    },
  },
  plugins: [],
};
