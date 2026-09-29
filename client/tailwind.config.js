/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#080A0C', // Primary background
          900: '#101316', // Secondary background
          850: '#14171C', // Card background
          800: '#1A1D24', // Surface border / muted element
          700: '#262A33', // Input/hover bg
        },
        lime: {
          accent: '#C8FF00', // Primary Accent
          dark: '#8FAF00',   // Secondary Accent
          dim: 'rgba(200, 255, 0, 0.12)',
        },
        cyber: {
          green: '#39FF88',  // Success
          warning: '#FFB84D',// Warning
          danger: '#FF4D5A', // Danger
          gray: '#9CA3AF'    // Secondary text
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
