const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Presicav", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        blue10: "011582",
        blue100: "#000321",

        purple0: "#A500FB",
      },
    },
  },
  plugins: [],
};
