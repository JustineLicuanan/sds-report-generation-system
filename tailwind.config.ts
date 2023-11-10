import { type Config } from 'tailwindcss';

export default{
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        yellow: '#f7b205',
        green: '#2A9134',
        gray: '#d9d9d9',
        red: '#dc3545',
      },
    },
  },
  plugins: [],
 } satisfies Config;
