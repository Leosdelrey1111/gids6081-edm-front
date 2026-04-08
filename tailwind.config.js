import { heroui } from '@heroui/theme';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  plugins: [
    heroui({
      themes: {
        dark: {
          colors: {
            primary: {
              50:  '#eef2ff',
              100: '#e0e7ff',
              200: '#c7d2fe',
              300: '#a5b4fc',
              400: '#818cf8',
              500: '#6366f1',
              600: '#4f46e5',
              700: '#4338ca',
              800: '#3730a3',
              900: '#312e81',
              DEFAULT: '#6366f1',
              foreground: '#ffffff',
            },
            success: {
              DEFAULT: '#22c55e',
              foreground: '#ffffff',
            },
            focus: '#6366f1',
          },
        },
        light: {
          colors: {
            primary: {
              50:  '#eef2ff',
              100: '#e0e7ff',
              200: '#c7d2fe',
              300: '#a5b4fc',
              400: '#818cf8',
              500: '#6366f1',
              600: '#4f46e5',
              700: '#4338ca',
              800: '#3730a3',
              900: '#312e81',
              DEFAULT: '#6366f1',
              foreground: '#ffffff',
            },
            success: {
              DEFAULT: '#22c55e',
              foreground: '#ffffff',
            },
            focus: '#6366f1',
          },
        },
      },
    }),
  ],
};
