/** @type {import('tailwindcss').Config} */
import {PlayerColorBank} from './src/components/app/consts';
import daisyui from 'daisyui';

export default {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    safelist: [
        `text-${PlayerColorBank.player1}`,
        `text-${PlayerColorBank.player2}`,
        `text-${PlayerColorBank.player3}`,
        `text-${PlayerColorBank.player4}`,
        `text-${PlayerColorBank.player5}`,
        `border-b-${PlayerColorBank.player1}`,
        `border-b-${PlayerColorBank.player2}`,
        `border-b-${PlayerColorBank.player3}`,
        `border-b-${PlayerColorBank.player4}`,
        `border-b-${PlayerColorBank.player5}`,
        `bg-${PlayerColorBank.player1}`,
        `bg-${PlayerColorBank.player2}`,
        `bg-p${PlayerColorBank.player3}`,
        `bg-${PlayerColorBank.player4}`,
        `bg-${PlayerColorBank.player5}`,

    ],
    theme: {
    },
    plugins: [daisyui],
};

