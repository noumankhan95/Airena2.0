import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          main: "#f56300", // Replace with your desired color
          light: "#f56300", // Optional: lighter shade
          dark: "#1E40AF", // Optional: darker shade
        },
        mint: {
          DEFAULT: "#46C190",
          dark: "#3da883",
          darker: "#348f76",
          light: "#e6f7f3",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
