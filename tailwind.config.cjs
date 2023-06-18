/** @type {import('tailwindcss').Config} */
export default {
   content: [
      "src/pages/**/*.{js,ts,jsx,tsx}",
      "src/components/**/*.{js,ts,jsx,tsx}",
      "src/contexts/**/*.{js,ts,jsx,tsx}",
      "src/utils/**/*.{js,ts,jsx,tsx}",
      "src/hooks/**/*.{js,ts,jsx,tsx}",
   ],
   theme: {
      extend: {},
   },
   plugins: [
      require("@tailwindcss/forms"),
   ],
}

