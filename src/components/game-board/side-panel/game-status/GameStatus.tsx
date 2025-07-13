import React, { useEffect, useMemo } from 'react';
import ProgressBar from '@components/ProgressBar/ProgressBar';
import {useGame} from '@contexts/game.context.tsx';
import { TURN_TIME } from '@components/app/consts.ts';

export interface GameStatusProps extends ChildProps, ParsedGame {
    updatePlayerTurn: () => void,
    endGame: () => void,
}

export default function GameStatus({
                                       activePlayer,
                                       nextPlayer,
                                       currentPlayerTime,
                                       maxEntries,
                                       totalTurns,
                                       endGame
                                   }: GameStatusProps): React.JSX.Element {
    const { story } = useGame();
    useEffect(() => {
        if (totalTurns <= 0 || (story.entries?.length || 0) >= maxEntries) {
            endGame();
        }
    }, [totalTurns, endGame, story.entries, maxEntries]);

    const maxTime = TURN_TIME / 1000; // Total turn time in seconds
    const remainingTime = Math.max(0, maxTime - currentPlayerTime);
    const percentage = useMemo(() => {
        if (maxTime === 0) return 0;
        return (remainingTime / maxTime) * 100;
    }, [remainingTime, maxTime]);

    // Always use smooth animation, restart when player changes
    const animationKey = `${activePlayer?.id}`;
    const shouldAnimate = true; // Always animate

    return (
        <div className='flex flex-col space-y-3'>
            <h2 className='text-lg font-bold text-amber-500 mb-4'>Game Status</h2>
            <div className='text-amber-400'><span
                className={ `text-${ activePlayer?.color } font-bold` }>{ activePlayer?.name }'s</span> Turn
            </div>
            <ProgressBar 
                percentage={percentage} 
                color={activePlayer?.color} 
                animated={shouldAnimate}
                animationKey={animationKey}
            />
            <div className='text-amber-300'>Turns left: <span className='font-bold text-amber-400'>{ totalTurns }</span></div>
            <div className='text-amber-300'>Next player: <span className={ `text-${ nextPlayer?.color } font-bold` }>{ nextPlayer?.name }</span></div>
            <div className='text-amber-300/70 text-sm'>Time remaining: <span className='font-bold'>{ remainingTime }s</span></div>
        </div>
    );
}
