/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        progressBar: {
          "0%": { width: "0%" },
          "50%": { width: "70%" },
          "100%": { width: "100%" },
        },
        toastUp: {
          "0%": {
            left: "50%",
            transform: "translateX(-50%) translateY(20px)",
            opacity: "0",
          },
          "100%": {
            left: "50%",
            transform: "translateX(-50%) translateY(0)",
            opacity: "1",
          },
        },
      },
      animation: {
        progressBar: "progressBar 4s ease-in-out forwards",
        toastSlide: "toastUp 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
