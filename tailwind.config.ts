import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "legal-navy": "#1A2B3C",
        "prestige-gold": "#C5A059",
        "ink-black": "#0F172A",
        "paper-white": "#FFFFFF",
        "stone-gray": "#E2E8F0",
        "background": "#F8F7F4",
        "on-background": "#191c1d",
        "on-surface": "#191c1d",
        "on-surface-variant": "#44474c",
        "surface-container": "#edeeef",
        "surface-container-low": "#f3f4f5",
        "surface-container-lowest": "#ffffff",
        "primary": "#041627",
        "error": "#ba1a1a",
        "error-container": "#ffdad6",
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem",
      },
      spacing: {
        "container-max": "1200px",
        "margin-mobile": "16px",
        "article-max": "720px",
        "section-gap": "80px",
        "gutter": "24px",
      },
      fontFamily: {
        "body-lg": ["var(--font-inter)"],
        "headline-md": ["var(--font-playfair)"],
        "display-lg-mobile": ["var(--font-playfair)"],
        "label-caps": ["var(--font-inter)"],
        "nav-link": ["var(--font-inter)"],
        "headline-sm": ["var(--font-playfair)"],
        "display-lg": ["var(--font-playfair)"],
        "body-md": ["var(--font-inter)"],
      },
      fontSize: {
        "body-lg": ["18px", { lineHeight: "30px", fontWeight: "400" }],
        "headline-md": ["32px", { lineHeight: "40px", fontWeight: "600" }],
        "display-lg-mobile": ["36px", { lineHeight: "44px", fontWeight: "700" }],
        "label-caps": ["12px", { lineHeight: "16px", letterSpacing: "0.1em", fontWeight: "600" }],
        "nav-link": ["14px", { lineHeight: "20px", fontWeight: "500" }],
        "headline-sm": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "display-lg": ["48px", { lineHeight: "60px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "body-md": ["16px", { lineHeight: "26px", fontWeight: "400" }],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
