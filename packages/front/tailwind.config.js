const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Presicav", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        blue: {
          10: "#011582",
          100: "#000321",
        },
        purple: {
          0: "#A500FB",
          1: "#2C0049",
        },
        pink: {
          0: "#F124AD",
        },
      },
      animation: {
        sliding: "sliding 32s linear infinite",
        slider: "scroll 120s linear infinite",
      },
      keyframes: {
        sliding: {
          from: {
            transform: "translateX(100%)",
          },
          to: {
            transform: "translateX(-100%)",
          },
        },
        scroll: {
          from: {
            transform: "translateX(0)",
          },
          to: {
            transform: "translateX(calc(-594px * 7))",
          },
        },
      },
      screens: {
        web: "1620px",
      },
    },
  },
  plugins: [],
};
