import React, { useEffect, useMemo } from 'react';
import { useTimer } from '@contexts/timer.context';
import ProgressBar from '@components/ProgressBar/ProgressBar';

export interface GameStatusProps extends ChildProps, Game {
    updatePlayerTurn: () => void,
    endGame: () => void
}

export default function GameStatus({
                                       activePlayer,
                                       nextPlayer,
                                       updatePlayerTurn,
                                       currentPlayerTime,
                                       totalTurns,
                                       endGame
                                   }: GameStatusProps): React.JSX.Element {
    const { timer, stopCountdown } = useTimer();

    const isTimerEnd = useMemo(() => timer === 0, [timer]);

    useEffect(() => {
        if (isTimerEnd) {
            updatePlayerTurn();
        }

    }, [isTimerEnd, updatePlayerTurn]);

    useEffect(() => {
        if (totalTurns <= 0) {
            stopCountdown();
            endGame();
        }
    }, [totalTurns, endGame, stopCountdown]);

    const percentage = useMemo(() => (timer / currentPlayerTime) * 100, [timer, currentPlayerTime]);

    return (
        <div className='flex flex-col p-5 border-2'>
            <div className='font-bold'><span
                className={ `text-${ activePlayer?.color }` }>{ activePlayer?.name }'s</span> Turn
            </div>
            <ProgressBar percentage={ percentage } color={ activePlayer?.color }/>
            <div className='font-bold'>Turns left: { totalTurns }</div>
            <div>Next player: <span className={ `text-${ nextPlayer?.color }` }>{ nextPlayer?.name }</span></div>
        </div>
    );
}
