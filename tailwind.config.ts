import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        aceBlue: "#0868a8",
        aceBlueDeep: "#054b7f",
        aceRed: "#e1262b",
        aceInk: "#171a1f",
        acePaper: "#f8f9fa"
      },
      boxShadow: {
        ace: "0 18px 50px rgba(22, 28, 38, .14)"
      }
    }
  },
  plugins: []
};

export default config;
