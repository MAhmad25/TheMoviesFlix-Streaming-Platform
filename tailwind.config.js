import flowbiteReact from "flowbite-react/plugin/tailwindcss";

/** @type {import('tailwindcss').Config} */
export default {
      content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", ".flowbite-react\\class-list.json", "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}"],
      theme: {
            extend: {
                  fontFamily: {
                        Stoshi: ["Satoshi", "sans-serif"],
                  },
            },
      },
      plugins: [flowbiteReact],
};
