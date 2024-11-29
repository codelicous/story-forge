import React from 'react';
import {StoryEntry, useGame} from '@contexts/game.context.tsx';

export const GameOver = (): React.JSX.Element => {
    const {story} = useGame();
    return <div className='size-full flex justify-center items-center'>
        <div className='text-3xl max-w-2xl p-2.5 flex justify-center'>
            {`${story.opener} ${story.entries.reduce<string>((acc: string, currentValue: StoryEntry) =>
                acc.concat(' ' + currentValue.text), '')}`}
        </div>
    </div>;
};