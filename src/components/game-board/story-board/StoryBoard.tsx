import React, {ChangeEvent, useCallback, useEffect, useRef, useState} from 'react';
import {useGame} from '@contexts/game.context.tsx';
import openings from '@assets/openings.json';
import classNames from 'classnames';
import {MAX_WORDS, MIN_WORDS} from '@components/app/consts.ts';
import { useWebSocket } from '@contexts/websocket.context.tsx';

export type StoryBoardProps = ChildProps &
    {
        updatePlayerTurn: () => void,
        game: ParsedGame,
        isTurnLoading: boolean,
    };

export default function StoryBoard({className, updatePlayerTurn, game, isTurnLoading}: StoryBoardProps): React.JSX.Element {

    const [activeText, setActiveText] = useState<string>('');
    const [inputDisabled, setInputDisabled] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const {addEntry, addOpener, content, story} = useGame();
    const { addSocketEntry } = useWebSocket();
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

    // Auto-focus input when turn loading completes
    useEffect(() => {
        if (!isTurnLoading && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isTurnLoading]);

    const submitText = useCallback(() => {
        if (wordCounter < MIN_WORDS) {
            setTextValidationAlert(validationText);
            return;
        }

        if (inputDisabled || isTurnLoading) {
            return;
        }

        addEntry({
            turn: game.totalTurns, user: game.activePlayer?.name || '', text: activeText.trim()
        });
        addSocketEntry(activeText.trim(), game.activePlayer.name)
        inputRef?.current?.focus();
        setActiveText('');

    }, [activeText, addEntry, game.activePlayer?.name, game.totalTurns, inputDisabled, isTurnLoading, updatePlayerTurn, validationText, wordCounter]);

    const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const newValue = e.target.value;
        setActiveText(newValue);

        setTextValidationAlert('');
        setInputDisabled(false);

        const currentWordCount = newValue.trim().split(/\s+/).length;
        setWordCounter(currentWordCount);

        if (currentWordCount < MIN_WORDS) {
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

    return (
        <div className={`${className} flex flex-col h-full p-6`}>
            <div className='bg-gray-700/30 rounded-lg p-6 mb-6 flex-1'>
                <h2 className='text-xl font-bold text-amber-500 mb-6 text-center'>Story in Progress</h2>
                <div className='text-container bg-gray-800/50 rounded-lg p-6 h-full overflow-y-auto'>
                    <div className='max-w-none text-lg leading-relaxed text-amber-200'>
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
                                disabled={isTurnLoading}
                                className={`ml-2 bg-transparent h-7 w-fit text-lg
                            border-b-2 border-b-${game.activePlayer?.color}
                            outline-0 text-${game.activePlayer?.color} placeholder-${game.activePlayer?.color}/50
                            ${isTurnLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                placeholder={isTurnLoading ? 'Processing turn...' : 'Add your words...'}
                            />
                        </span>
                    </div>
                </div>
            </div>
            <div className='flex justify-center'>
                <button 
                    onClick={submitText}
                    disabled={inputDisabled || !activeText || isTurnLoading}
                    className={`px-8 py-3 rounded-lg font-bold text-lg transition-all ${
                        inputDisabled || !activeText || isTurnLoading
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-gray-900 shadow-lg hover:shadow-amber-500/25'
                    }`}>
                    {isTurnLoading ? (
                        <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                        </span>
                    ) : (
                        `Add Words (${wordCounter}/${MAX_WORDS})`
                    )}
                </button>
            </div>
        </div>
    );
}