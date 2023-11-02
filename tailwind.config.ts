import { type Config } from 'tailwindcss';
const withMT = require("@material-tailwind/react/utils/withMT");
 
export default withMT({
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        yellow: '#f7b205',
        green: '#2A9134',
        gray: '#d9d9d9'
      }
    },
  },
  plugins: [
  ],
}) satisfies Config;
