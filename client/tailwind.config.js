/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        primaryRegular: ["Helvetica", "sans-serif"],
        primaryBold: ["Helvetica-Bold", "sans-serif"],
        primaryLight: ["Helvetica-Light", "sans-serif"],
        succinct: ["Succinct", "sans-serif"],
        normalLight: ["NormalLight", "sans-serif"],
        style: ["Style", "sans-serif"],
        title: ["Title", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        default:
          "0px 2px 4px rgba(0, 0, 0, .1), 0px 8px 16px rgba(0, 0, 0, .1)",
        forgetPw: "2px 2px 2px 1px rgba(0, 0, 0, 0.2)",
        bgContent: "inset 0 0 0 2px #fff, 0 0 5px 0 rgba(0, 0, 0, .2)",
        stories: "0 1px 4px rgba(0, 0, 0, 0.1)",
        optionConversation:
          "0 12px 28px 0 rgba(0, 0, 0, .2), 0 2px 4px 0 rgba(0, 0, 0, .1)",
        headerContent: "0 0 4px rgba(0, 0, 0, 0.2)",
        blurEmoji:
          "0 12px 28px 0 rgba(0, 0, 0, .2), 0 2px 4px 0 rgba(0, 0, 0, .1)",
        blurEmoji:
          "0 12px 28px 0 rgba(0, 0, 0, .2), 0 2px 4px 0 rgba(0, 0, 0, .1), inset 0 0 0 1px rgba(255, 255, 255, .5)",
      },
      backgroundSize: {
        100: "100%",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
