/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'; //---> import the plugin de daisyui
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [daisyui], // add the plugin to the config
};
