import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
    plugins: [
        typography,
    ],
    theme: {
        fontFamily: {
          'sans': ['Inter', 'Noto Sans JP', 'sans-serif'],
        },
        extend: {},
    },
    purge: ["./index.html",'./src/**/*.{svelte,js,ts}'],
    variants: {
        extend: {},
    },
}