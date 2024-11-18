import React, {useCallback, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import SidePanel from './side-panel/SidePanel';
import StoryBoard from './story-board/StoryBoard';
import {
    GameState,
    MAX_ENTRIES,
    MAX_TURNS_PER_PLAYER,
    TURN_TIME,
} from '../app/consts';
import {StartGameDialog} from '@components/app/game-board/start-game-dialog/StartGameDialog';
import { useGame } from '@contexts/game.context';
import { useTimer } from '@contexts/timer.context.tsx';

function GameBoard({className}: ChildProps): React.JSX.Element {
    const { config : { players, openerCategory } } = useGame();

    const navigate = useNavigate();
    const { startCountdown } = useTimer();

    const [game, setGame] = useState<Game>({
        content: '',
        openerCategory,
        players,
        activePlayer: null,
        nextPlayer: null,
        state: GameState.InGame,
        currentPlayerTime: TURN_TIME,
        totalTurns: players.length * MAX_TURNS_PER_PLAYER,
        maxEntries: MAX_ENTRIES
    });
    const [showGameDialog, setShowGameDialog] = useState(true);

    const okDialogAction = useCallback(() => {
        setShowGameDialog(false);
        startCountdown();
    },[startCountdown, setShowGameDialog]);

    const setEndGame = useCallback(() => {
        // TODO: Add logic to end the game
        setGame((prevGame: Game) => ({
            ...prevGame,
            state: GameState.Ended
        }));

        navigate('/game-over');
    }, [navigate, setGame]);

const updatePlayerInsideGameObject = useCallback((prevGame: Game) => {
    const currentPlayer = prevGame.activePlayer;
    const currentPlayerIndex = prevGame.players.indexOf(currentPlayer!);
    const nextPlayerIndex = (currentPlayerIndex + 1) % prevGame.players.length;
    return {
        ...prevGame,
        totalTurns: prevGame.totalTurns - 1,
        activePlayer: prevGame.players[nextPlayerIndex],
        nextPlayer: prevGame.players[(nextPlayerIndex + 1) % prevGame.players.length],

    };
},[]);

    const updatePlayerTurn = useCallback(() => {
        setGame(updatePlayerInsideGameObject);
        startCountdown();
    }, [updatePlayerInsideGameObject, startCountdown]);

    // useEffect to initialize the game
    useEffect(() => {
        if(showGameDialog) {
            setGame((prevGame: Game) => ({
                ...prevGame,
                activePlayer: prevGame.players[0],
                nextPlayer: prevGame.players[1]
            }));
        }

    }, [showGameDialog]);

    return (
        <div className= {className}>
            <SidePanel className='flex basis-1/3 flex-col justify-center'
                       game={game}
                       endGame={setEndGame}
                       updatePlayerTurn={updatePlayerTurn}>
            </SidePanel>
            <StoryBoard className='flex basis-2/3
                max-2xl board-container flex-col p-6
                 relative justify-center align-middle items-center'
                        game={game}
                        updatePlayerTurn={updatePlayerTurn}>
            </StoryBoard>
            <StartGameDialog
                triggerStartGame={okDialogAction}
                isOpen={showGameDialog}
                startingPlayerName={game?.activePlayer?.name || ''}/>
        </div>
    );
}

export default GameBoard;
