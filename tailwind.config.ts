import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#01dbe5',
        secondary: '#7655e6',
        dark: '#333',
        light: '#fff',
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        body: ['Source Sans Pro', 'sans-serif'],
      },
      spacing: {
        21: '21px',
      },
      maxWidth: {
        1200: '1200px',
      },
      borderRadius: {
        large: '24px',
        medium: '16px',
        small: '12px',
        'extra-small': '6px',
      },
      backgroundColor: {
        dark: {
          100: '#2f2e3e',
          200: '#003e70',
        },
        light: {
          100: '#f4f4f4',
          200: '#fff',
        },
      },
      textColor: {
        light: '#fff',
        darker: '#003e70',
        dark: '#333',
      },
      boxShadow: {
        'medium-light': '0px 2px 10px 1px rgba(255, 255, 255, 0.1)',
        medium: '0px 14px 10px 5px rgba(0, 0, 0, 0.2)',
        small: '0px 2px 10px 1px rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fill: {
        light: '#fff',
      },
    },
  },
  plugins: [],
}
export default config
