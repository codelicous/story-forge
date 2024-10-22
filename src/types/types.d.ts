import {GameState, PlayerColorBank} from '@components/app/consts.ts';
declare global {
    export interface Player {
        id: number;
        name: string;
        color: PlayerColor;
    }

    export interface Game {
        name?: string;
        id?: string;
        content: string;
        openerCategory: 'random'| 'mystery' |'funny';
        starter?: string;
        state: GameState;
        players: Player[];
        activePlayer: Player| null;
        nextPlayer: Player| null;
        currentPlayerTime: number
        totalTurns: number;
    }
    export interface ChildProps {
        className?: string;
    }
    export type PlayerColor = typeof PlayerColorBank[keyof typeof PlayerColorBank];
}
