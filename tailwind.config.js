/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./app/match/**/*.{js,jsx,ts,tsx}",
    "./app/match/ongoing/**/*.{js,jsx,ts,tsx}",
    "./app/(tabs)/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "cool-gray": "#7c7ea2ff",
        periwinkle: "#d1d2f9ff",
        "jordy-blue": "#87A2E5",
        "vista-blue": "#7796cbff",
        "ultra-violet": "#576490ff",
      },
    },
  },
  plugins: [],
};
