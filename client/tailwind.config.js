module.exports = {
  mode: "jit",
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        poppins: ['"Poppins"', "sans-serif"],
        roboto: ['"Roboto"', "sans-serif"],
      },
      colors: {
        "main-black": "#131417",
        "main-gray": "#252830",
        "secondary-gray": "#868CA0",
        link: "#5185F3",
        black: "#000000",
        white: "#FFFFFF",
        warning: "#DE3F44",
        success: "#1BA345",
      },
      width: {
        "fit-content": "fit-content",
      },
      height: {
        "fit-content": "fit-content",
      },
    },
  },
  variants: {
    extend: {
      visibility: ["group-hover"],
    },
  },
  plugins: [],
};
