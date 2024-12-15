export enum GameState {
    Create,
    InGame,
    Ended,
}

export const TURN_TIME = 50_000;
export const MAX_TURNS_PER_PLAYER = 4;
export const MIN_WORDS = 2;
export const MAX_WORDS = 10;
export const MAX_ENTRIES = 15;

export const PlayerColorBank = {
    player1: 'amber-400',
    player2:  'red-500',
    player3:  'lime-500',
    player4:  'fuchsia-600',
    player5:  'violet-500',
} as const;

export const MAX_PLAYERS = Object.keys(PlayerColorBank).length;
export const quickPlayPlayers = [
    {id:1 , name: 'Player 1', color: PlayerColorBank.player1},
    {id:2 , name: 'Player 2', color: PlayerColorBank.player2},
];