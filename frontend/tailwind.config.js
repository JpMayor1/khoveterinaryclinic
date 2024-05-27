/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        colors: {
            dark: "#181823",
            light: "#FFFBF5",
            light2: "#F5F7F8",
            primary: "#FF5F00",
            red: "#C70039",
            grey: "#2C3333",
            "dark-green": "#2E4F4F",
            "light-green": "#0E8388",
            "dark-blue": "#232D3F",
            "cyan-blue": "#A0E9FF",
        },
        fontFamily: {
            sans: ["Poppins", "sans-serif"],
        },
    },
    plugins: [
        // eslint-disable-next-line no-undef
        require("@tailwindcss/forms"),
    ],
};
