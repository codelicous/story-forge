import React, { KeyboardEvent, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@contexts/game.context';
import { MAX_PLAYERS, PlayerColorBank, quickPlayPlayers } from '@components/app/consts';
import openings from '@assets/openings.json';
import funnyIcon from '@assets/category-icons/funny.svg';
import mysteryIcon from '@assets/category-icons/mystery.svg';
import randomIcon from '@assets/category-icons/random.svg';

const categories = Object.keys(openings);
const playerColors = Object.values(PlayerColorBank);

const colorDisplayNames: Record<string, string> = {
    'amber-400': 'Amber',
    'red-500': 'Red',
    'lime-500': 'Green',
    'fuchsia-600': 'Purple',
    'violet-500': 'Violet'
};

const categoryIcons: Record<string, React.JSX.Element> = {
    funny: (
        <img
            src={ funnyIcon }
            alt="Funny"
            className="w-7 h-7"
            style={ {
                filter: 'brightness(0) saturate(100%) invert(69%) sepia(56%) saturate(434%) hue-rotate(4deg) brightness(99%) contrast(92%)',
                transform: 'scale(0.9)',
                strokeWidth: '0.5px'
            } }
        />
    ),
    mystery: (
        <img
            src={ mysteryIcon }
            alt="Mystery"
            className="w-8 h-8"
            style={ {
                filter: 'brightness(0) saturate(100%) invert(69%) sepia(56%) saturate(434%) hue-rotate(4deg) brightness(99%) contrast(92%)',
                strokeWidth: '2px'
            } }
        />
    ),
    random: (
        <img
            src={ randomIcon }
            alt="Random"
            className="w-8 h-8"
            style={ {
                filter: 'brightness(0) saturate(100%) invert(69%) sepia(56%) saturate(434%) hue-rotate(4deg) brightness(99%) contrast(92%)',
                strokeWidth: '2px'
            } }
        />
    )
};

export const Welcome = (): React.JSX.Element => {
    const navigate = useNavigate();
    const { config: { players, openerCategory }, setConfig } = useGame();
    const [currentPlayerName, setCurrentPlayerName] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);

    const onCategoryChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setConfig((prevState) => ({ ...prevState, openerCategory: event.target.value as Game['openerCategory'] }));
    }, [setConfig]);

    const isGameValid = useCallback(() => players?.length > 1 && players.every(player => player.name.trim().length > 2), [players]);
    const playerNameValid = useCallback(() => currentPlayerName.length > 2, [currentPlayerName]);

    const addPlayer = useCallback(() => {
        if (currentPlayerName) {
            setConfig((prevState) => ({
                ...prevState,
                players: [...prevState.players, {
                    name: currentPlayerName,
                    id: prevState.players.length + 1,
                    color: playerColors[prevState.players.length]
                }]
            }));
            setCurrentPlayerName('');
        }
    }, [setConfig, currentPlayerName]);

    const onInputKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && playerNameValid()) {
            addPlayer();
        }
    }, [addPlayer, playerNameValid]);

    const onPlayClick = useCallback(() => {
        navigate('/game');
    }, [navigate]);

    const onQuickPlayClick = useCallback(() => {
        setConfig((prevState) => ({ ...prevState, players: quickPlayPlayers }));
        navigate('/quickplay');
    }, [navigate, setConfig]);

    const onOpenRoomClick = useCallback(() => {
        navigate('/lobby-room');
    }, [navigate]);


    const removePlayer = useCallback((playerId: number) => {
        setConfig((prevState) => ({
            ...prevState,
            players: prevState.players.filter(player => player.id !== playerId)
        }));
    }, [setConfig]);

    const getNextPlayerColor = useCallback(() => {
        if (players.length < playerColors.length) {
            return playerColors[players.length];
        }
        return playerColors[0]; // fallback
    }, [players.length]);

    const getNextPlayerColorName = useCallback(() => {
        const colorKey = getNextPlayerColor();
        return colorDisplayNames[colorKey] || 'Unknown';
    }, [getNextPlayerColor]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-6 md:py-12 px-4 overflow-x-hidden">
            <div
                className="max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8 lg:p-10">
                <div className="flex justify-center mb-6 md:mb-8">
                    <img src='src/assets/story_forge.png' alt='StoryForge Logo'
                         className="h-24 md:h-32 animate-pulse-slow"/>
                </div>

                <h1 className="text-2xl md:text-3xl lg:text-4xl font-medieval text-amber-500 mb-4 text-center">Forge
                    Your Tale</h1>
                <p className="text-amber-300/90 text-center text-sm md:text-base mb-6 md:mb-8">
                    Collaborate with friends to create amazing stories, one word at a time
                </p>

                {/* Category Selection */ }
                <div className="mb-6 md:mb-8">
                    <h2 className="text-lg md:text-xl font-bold text-amber-500 mb-4">
                        Choose a Story Theme
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        { categories.map((category) => (
                            <label
                                key={ category }
                                className={ `
                                    flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200
                                    ${ openerCategory === category
                                    ? 'bg-amber-600/20 border-2 border-amber-500'
                                    : 'bg-gray-700/50 border-2 border-transparent hover:border-amber-500/50' }
                                ` }
                            >
                                <input
                                    checked={ openerCategory === category }
                                    onChange={ onCategoryChange }
                                    type="radio"
                                    name="category"
                                    value={ category }
                                    className="radio h-5 w-5 text-amber-500 bg-gray-700 border-amber-500 checked:bg-amber-500 checked:shadow-[0_0_0_4px_#2e2e2e_inset,_0_0_0_4px_#2e2e2e_inset] hidden"
                                />
                                <div className={ `w-5 h-5 rounded-full mr-3 border-2 flex items-center justify-center
                                    ${ openerCategory === category
                                    ? 'border-amber-500 bg-gray-800'
                                    : 'border-amber-500/50 bg-transparent' }
                                ` }>
                                    { openerCategory === category && (
                                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                                    ) }
                                </div>
                                <div className="flex items-center space-x-2">
                                    { categoryIcons[category] }
                                    <span className="text-amber-400 capitalize">{ category }</span>
                                </div>
                            </label>
                        )) }
                    </div>
                </div>

                {/* Player Management */ }
                <div className="mb-6 md:mb-8">
                    <h2 className="text-lg md:text-xl font-bold text-amber-500 mb-4 flex items-center justify-between">
                        <span>
                            Add Players <span
                            className="text-sm font-normal">({ players.length }/{ MAX_PLAYERS })</span>
                        </span>
                        { isInputFocused && (
                            <div className="flex items-center space-x-2">
                                <div className={ `w-3 h-3 rounded-full bg-${ getNextPlayerColor() }` }></div>
                                <span className={ `text-${ getNextPlayerColor() } text-sm` }>
                                    Next player will be <span
                                    className="font-medium">{ getNextPlayerColorName() }</span>
                                </span>
                            </div>
                        ) }
                    </h2>

                    <div className="flex gap-3 mb-4">
                        <input
                            onKeyDown={ e => onInputKeyDown(e) }
                            onFocus={ () => setIsInputFocused(true) }
                            onBlur={ () => setIsInputFocused(false) }
                            value={ currentPlayerName }
                            onChange={ event => setCurrentPlayerName(event.target.value) }
                            className={ `flex-grow bg-gray-700 border-2 border-amber-500/50 focus:border-amber-500 text-${ getNextPlayerColor() } rounded-lg px-4 py-2.5 ${ isInputFocused ? `placeholder-${ getNextPlayerColor() }/70` : 'placeholder-amber-400/70' } outline-none transition-all` }
                            placeholder="Enter player name..."
                            type="text"
                            maxLength={ 20 }
                        />
                        <button
                            disabled={ !playerNameValid() || players.length >= MAX_PLAYERS }
                            className={ `px-4 py-2.5 rounded-lg font-bold transition-all ${
                                playerNameValid() && players.length < MAX_PLAYERS
                                    ? 'bg-amber-600 hover:bg-amber-500 text-gray-900 border-0'
                                    : 'bg-gray-600 text-gray-400 cursor-not-allowed border-0'
                            }` }
                            style={ playerNameValid() && players.length < MAX_PLAYERS
                                ? { backgroundColor: '#d97706' }
                                : { backgroundColor: '#4b5563' }
                            }
                            onClick={ addPlayer }
                        >
                            Add
                        </button>
                    </div>

                    {/* Player List */ }
                    { players.length > 0 && (
                        <div className="bg-gray-700/30 rounded-lg p-3">
                            <h3 className="text-amber-400 text-sm mb-2 uppercase tracking-wider font-bold">Players:</h3>
                            <ul className="space-y-2">
                                { players.map((player) => (
                                    <li key={ player.id }
                                        className="flex items-center justify-between bg-gray-700/40 rounded-md p-2.5">
                                        <div className="flex items-center">
                                            <div className={ `w-3 h-3 rounded-full bg-${ player.color } mr-3` }></div>
                                            <span
                                                className={ `text-${ player.color } font-medium` }>{ player.name }</span>
                                        </div>
                                        <button
                                            onClick={ () => removePlayer(player.id) }
                                            className="text-gray-400 hover:text-red-400 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                                                 viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd"
                                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                      clipRule="evenodd"/>
                                            </svg>
                                        </button>
                                    </li>
                                )) }
                            </ul>
                        </div>
                    ) }
                </div>

                {/* Buttons */ }
                <div className="space-y-3">
                    <button
                        disabled={ !isGameValid() }
                        className={ `w-full py-3 rounded-lg font-bold text-lg transition-all ${
                            isGameValid()
                                ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-gray-900 shadow-lg hover:shadow-amber-500/25'
                                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        }` }
                        onClick={ onPlayClick }
                    >
                        { isGameValid() ? 'Local Game' : 'Need at least 2 players' }
                    </button>

                    <button
                        className="w-full py-3 rounded-lg font-bold text-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-gray-900 shadow-lg hover:shadow-amber-500/25 transition-all"
                        onClick={ onQuickPlayClick }
                    >
                        Quick Local Play (2 Players)
                    </button>

                    <button
                        className="w-full py-3 rounded-lg font-bold text-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-gray-900 shadow-lg hover:shadow-amber-500/25 transition-all"
                        onClick={ onOpenRoomClick }
                    >
                        Open a new Room
                    </button>

                </div>

                {/* Quote */ }
                <div className="mt-8 text-center">
                    <p className="text-amber-400/60 text-sm italic">
                        'Every great story begins with a single word...'
                    </p>
                    <p className="text-amber-400/40 text-xs mt-1">
                        - Someone, Whenever
                    </p>
                </div>
            </div>

            {/* Add a custom style tag for the font */ }
            <style>{ `
                @import url('https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap');
                
                .font-medieval {
                    font-family: 'MedievalSharp', cursive;
                }
                
                .animate-pulse-slow {
                    animation: pulse 3s infinite;
                }
                
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.9;
                        transform: scale(1.05);
                    }
                }
            ` }</style>
        </div>
    );
};