/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,jsx,ts,tsx}',
        './components/**/*.{js,jsx,ts,tsx}',
    ],
    presets: [require('nativewind/preset')],
    theme: {
        extend: {
            colors: {
                second: '#0a0a0a',
                primary: '#ededed',
                accent: '#00598a',
                outline: '##f5f5f5',
            },
        },
    },
};
