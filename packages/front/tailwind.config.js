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
      gridTemplateColumns: {
        "auto-fit": "repeat(auto-fit, minmax(18rem, 1fr))",
      },
      animation: {
        sliding: "sliding 32s linear infinite",
        slider: "scroll 120s linear infinite",
        "slider-right":
          "slider-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both",
        collapsed: "collapsed 1s cubic-bezier(0.250, 0.460, 0.450, 0.940) both",
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
        "slider-right": {
          from: {
            transform: "translateX(-300px)",
          },
          to: {
            transform: "translateX(0)",
          },
        },
        collapsed: {
          from: {
            transform: "translateX(0)",
          },
          to: {
            transform: "translateX(-300px)",
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
