const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    screens: {
      "2sm": "500px",
      ...defaultTheme.screens,
    },
    fontFamily: {
      poopins: ["Poppins", "sans-serif"],
    },
  },
  plugins: [],
};
