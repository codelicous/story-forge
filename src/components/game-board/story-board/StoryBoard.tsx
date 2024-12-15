import React, {ChangeEvent, useCallback, useEffect, useRef, useState} from 'react';
import {useGame} from '@contexts/game.context.tsx';
import openings from '@assets/openings.json';
import classNames from 'classnames';
import {MAX_WORDS, MIN_WORDS} from '@components/app/consts.ts';

export type StoryBoardProps = ChildProps &
    {
        updatePlayerTurn: () => void,
        game: Game,
    };

export default function StoryBoard({className, updatePlayerTurn, game}: StoryBoardProps): React.JSX.Element {

    const [activeText, setActiveText] = useState<string>('');
    const [inputDisabled, setInputDisabled] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const {addEntry, addOpener, content, story} = useGame();
    const [wordCounter, setWordCounter] = useState(0);
    const [textValidationAlert, setTextValidationAlert] = useState<string>('');
    const validationText = `Please insert a sentence between ${MIN_WORDS} and ${MAX_WORDS} words`;

    document.onclick = () => inputRef && inputRef.current?.focus();

    useEffect(() => {
        if (!story.opener) {
            const category = game.openerCategory || 'random';
            const selectedIndex = Math.floor(Math.random() * openings[category].length);
            addOpener(openings[category][selectedIndex]);
        }
    }, [addOpener, game.openerCategory, story.opener]);

    const clearState = (): void => {
        setActiveText('');
        setInputDisabled(false);
        setTextValidationAlert('');
    };

    const submitText = useCallback(() => {
        if (wordCounter <= MIN_WORDS) {
            setTextValidationAlert(validationText);
            return;
        }

        if (inputDisabled) {
            return;
        }

        addEntry({
            turn: game.totalTurns, user: game.activePlayer?.name || '', text: activeText.trim()
        });

        clearState();
        updatePlayerTurn();

    }, [activeText, addEntry, game.activePlayer?.name, game.totalTurns, inputDisabled, updatePlayerTurn, validationText, wordCounter]);

    const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const newValue = e.target.value;
        setActiveText(newValue);

        setTextValidationAlert('');
        setInputDisabled(false);

        const currentWordCount = newValue.trim().split(/\s+/).length;
        setWordCounter(currentWordCount);

        if (currentWordCount <= MIN_WORDS) {
            setInputDisabled(true);
        }

        if (currentWordCount > MAX_WORDS) {
            setTextValidationAlert(validationText);
            setInputDisabled(true);
            return;
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            submitText();
        }
    };

    return <div className={className}>
        <div className='flex flex-col h-3/4 w-full items-center'>
            <div className='text-container w-full h-3/4 flex flex-1 text-xl p-5'>
                <div className='max-w-2xl'>
                    {content}
                    <span className={classNames({
                        'tooltip': textValidationAlert,
                        'tooltip-warning': textValidationAlert,
                        'tooltip-open': textValidationAlert
                    })}
                          data-tip={textValidationAlert ? textValidationAlert : ''}>
                        <input
                            ref={inputRef}
                            autoFocus={true}
                            type='text'
                            value={activeText}
                            onKeyDown={handleKeyDown}
                            onChange={onChange}
                            className={`ml-2 bg-transparent h-7 w-fit text-xl
                        border-b-2
                         border-b-${game.activePlayer?.color}
                         outline-0 text-${game.activePlayer?.color}`}
                        ></input>
                    </span>
                </div>
            </div>
            <button onClick={submitText}
                    disabled={inputDisabled || !activeText}
                    className='w-56 mt-6 disabled:bg-gray-400
             disabled:cursor-not-allowed disabled:opacity-50'>Submit my Words
            </button>
        </div>
    </div>
;
}