import React, {ChangeEvent, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import { useGame } from '@contexts/game.context.tsx';
import openings from '@assets/openings.json';

export type StoryBoardProps = ChildProps &
    {
        updatePlayerTurn: () => void,
        game: Game,
    };

export default function StoryBoard({className, updatePlayerTurn, game}: StoryBoardProps): React.JSX.Element {

    const [activeText, setActiveText] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);
    const {addEntry, addOpener, story, config: {mode}} = useGame();
    document.onclick = () => inputRef && inputRef.current?.focus();

    useEffect(() => {
        if (!story.opener) {
            const category = game.openerCategory || 'random';
            const selectedIndex = Math.floor(Math.random() * openings[category].length);
            addOpener(openings[category][selectedIndex]);
        }
    }, [addOpener, game.openerCategory, story.opener]);

    const submitText = useCallback(() => {
        if (!activeText) {
            return;
        }

        addEntry({
            turn: game.totalTurns, user: game.activePlayer?.name || '', text: activeText.trim()
        });
        inputRef?.current?.focus();
        setActiveText('');
        updatePlayerTurn();

    }, [activeText, addEntry, game?.activePlayer?.name, game.totalTurns, updatePlayerTurn]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !inputDisabled) {
            e.preventDefault();
            submitText();
        }
    };

    const inputDisabled = useMemo(() => {
        const threeWordsPattern: RegExp = /^\S+ \S+ \S+$/;
        return !threeWordsPattern.test(activeText);
    }, [activeText]);

    return <div className={className}>
        <div className='flex flex-col h-3/4 w-full items-center'>
            <div className='text-container w-full h-3/4 flex flex-1 text-xl p-5'>
                <div>
                    ${story.opener}
                    {story.entries.map((entry, index) =>
                        <span style={{ filter: mode === 'last_2_entries' && index >= 2 && story.entries.length - index > 2 ?  'blur(4px)' : undefined}}>
                            {entry.text}
                        </span>)
                    }
                    <input
                        ref={inputRef}
                        autoFocus={true}
                        type='text'
                        value={activeText}
                        onKeyDown={handleKeyDown}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setActiveText(e.target.value)}
                        className={`ml-2 bg-transparent h-7 w-fit text-xl
                    border-b-2
                     border-b-${game.activePlayer?.color}
                     outline-0 text-${game.activePlayer?.color}`}
                    ></input>
                </div>
            </div>
            <button disabled={inputDisabled}
                    onClick={submitText}
                    className='w-56 mt-6 disabled:bg-gray-400
             disabled:cursor-not-allowed disabled:opacity-50'>Submit my Words
            </button>
        </div>
    </div>;
}
