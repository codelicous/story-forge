export enum GameState {
    Create,
    InGame,
    Ended,
}

export const TURN_TIME = 10_000;

export const MAX_TURNS_PER_PLAYER = 4;

export const PlayerColorBank = {
    player1: 'amber-400',
    player2:  'red-500',
    player3:  'lime-500',
    player4:  'fuchsia-600',
    player5:  'violet-500',
} as const;

export const MAX_PLAYERS = Object.keys(PlayerColorBank).length;