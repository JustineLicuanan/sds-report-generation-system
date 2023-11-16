import { type Config } from 'tailwindcss';

export default{
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        yellow: '#f7b205',
        green: '#2A9134',
        gray: '#d9d9d9',
        red: '#aa0000',
      },
    },
  },
  plugins: [],
 } satisfies Config;
