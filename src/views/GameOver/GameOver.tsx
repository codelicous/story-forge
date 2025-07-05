import React, { useCallback } from 'react';
import {StoryEntry, useGame} from '@contexts/game.context.tsx';
import { useNavigate } from 'react-router-dom';

export const GameOver = (): React.JSX.Element => {
    const navigate = useNavigate();
    const {story} = useGame();
    const mainMenu = useCallback(() => {
        navigate('/');
    }, [navigate]);
    return <div className='size-full flex justify-center items-center flex-col'>
        <div className='text-3xl max-w-2xl p-2.5 flex justify-center'>
            {`${story.opener} ${story.entries.reduce<string>((acc: string, currentValue: StoryEntry) =>
                acc.concat(' ' + currentValue.text), '')}`}
        </div>
        <button onClick={mainMenu} className='btn btn-primary mt-6'>Back To Menu</button>
    </div>;
};