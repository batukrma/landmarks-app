/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        lavishly: ['var(--font-lavishly-yours)'],
        geist: ['var(--font-geist-sans)'],
        geistMono: ['var(--font-geist-mono)'],
      },
      keyframes: {
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        shine: 'shine 2s linear infinite',
      },
    },
  },
  plugins: [],
};
