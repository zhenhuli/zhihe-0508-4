import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#fafaf9",
        foreground: "#1c1917",
        card: "#ffffff",
        "card-foreground": "#1c1917",
        primary: "#16a34a",
        "primary-foreground": "#ffffff",
        secondary: "#f5f5f4",
        "secondary-foreground": "#1c1917",
        muted: "#f5f5f4",
        "muted-foreground": "#78716c",
        border: "#e7e5e4",
        input: "#e7e5e4",
        ring: "#16a34a",
      },
    },
  },
  plugins: [],
};

export default config;
