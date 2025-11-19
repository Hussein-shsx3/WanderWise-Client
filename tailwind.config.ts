import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        "pulse": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "delay-2000": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) 2s infinite",
        "delay-1000": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) 1s infinite",
      },
      transitionDelay: {
        "2000": "2000ms",
        "1000": "1000ms",
      }
    },
  },
  plugins: [],
};
export default config;
