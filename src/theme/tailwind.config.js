import { plugin } from "twrnc";
import { Palette } from "./palette";

const customStyle = {
  "drop-shadow-100": {
    shadowColor: "rgba(28,28,28,0.6)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
};

const config = {
  theme: {
    colors: { ...Palette },
    spacing: {
      0: "0",
      1: "1",
      2: "2",
      xxs: "4",
      xs: "8",
      sm: "12",
      md: "16",
      mdp: "20",
      lg: "24",
      xl: "32",
      xlp: "40",
      xxl: "48",
      xxlp: "56",
    },
    borderRadius: {
      xxs: "4",
      xs: "6",
      sm: "10",
      md: "16",
      lg: "26",
      xl: "32",
      xxl: "40",
      DEFAULT: "16",
    },
    borderWidth: {
      DEFAULT: "1",
      0: "0",
      2: "2",
      3: "3",
      4: "4",
      8: "8",
    },
  },

  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities(customStyle);
    }),
  ],
};

export default config;
