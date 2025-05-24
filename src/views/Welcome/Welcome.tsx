import React, { KeyboardEvent, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@contexts/game.context';
import { MAX_PLAYERS, PlayerColorBank, quickPlayPlayers } from '@components/app/consts';
import openings from '@assets/openings.json';

const categories = Object.keys(openings);
const playerColors = Object.values(PlayerColorBank);

export const Welcome = (): React.JSX.Element => {
    const navigate = useNavigate();
    const { config: { players, openerCategory }, setConfig } = useGame();
    const [currentPlayerName, setCurrentPlayerName] = useState("");

    const onCategoryChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setConfig((prevState) => ({ ...prevState, openerCategory: event.target.value as Game['openerCategory'] }));
    }, [setConfig]);

    const isGameValid = useCallback(() => players?.length > 1 && players.every(player => player.name.trim().length > 2), [players]);
    const playerNameValid = useCallback(() => currentPlayerName.length > 2, [currentPlayerName]);

    const onInputKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && playerNameValid()) {
            addPlayer();
        }
    }, [currentPlayerName, playerNameValid]);

    const onPlayClick = useCallback(() => {
        navigate('/game');
    }, [navigate]);

    const onQuickPlayClick = useCallback(() => {
        setConfig((prevState) => ({ ...prevState, players: quickPlayPlayers }));
        navigate('/quickplay');
    }, [navigate, setConfig]);

    const testServerClick = useCallback(() => {
        navigate('/test-server');
    }, [navigate]);

    const addPlayer = useCallback(() => {
        if (currentPlayerName) {
            setConfig((prevState) => ({
                ...prevState,
                players: [...prevState.players, {
                    name: currentPlayerName,
                    id: prevState.players.length + 1,
                    color: playerColors[prevState.players.length + 1]
                }]
            }));
            setCurrentPlayerName('');
        }
    }, [setConfig, currentPlayerName]);

    const removePlayer = useCallback((playerId: number) => {
        setConfig((prevState) => ({
            ...prevState,
            players: prevState.players.filter(player => player.id !== playerId)
        }));
    }, [setConfig]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4">
            <div className="max-w-md mx-auto bg-gray-800 rounded-xl shadow-2xl overflow-hidden p-8 border border-amber-500/30">
                <div className="flex justify-center mb-8">
                    <img src='src/assets/story_forge.png' alt='StoryForge Logo' className="h-32 animate-pulse-slow" />
                </div>

                <h1 className="text-3xl font-medieval text-amber-500 mb-8 text-center">Forge Your Tale</h1>

                {/* Category Selection */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-amber-500 mb-4 border-b border-amber-500/30 pb-2">
                        Choose a Story Theme
                    </h2>

                    <div className="grid grid-cols-2 gap-3">
                        {categories.map((category) => (
                            <label
                                key={category}
                                className={`
                                    flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200
                                    ${openerCategory === category
                                    ? 'bg-amber-600/20 border-2 border-amber-500'
                                    : 'bg-gray-700/50 border-2 border-transparent hover:border-amber-500/50'}
                                `}
                            >
                                <input
                                    checked={openerCategory === category}
                                    onChange={onCategoryChange}
                                    type="radio"
                                    name="category"
                                    value={category}
                                    className="radio h-5 w-5 text-amber-500 bg-gray-700 border-amber-500 checked:bg-amber-500 checked:shadow-[0_0_0_4px_#2e2e2e_inset,_0_0_0_4px_#2e2e2e_inset] hidden"
                                />
                                <div className={`w-5 h-5 rounded-full mr-3 border-2 flex items-center justify-center
                                    ${openerCategory === category
                                    ? 'border-amber-500 bg-gray-800'
                                    : 'border-amber-500/50 bg-transparent'}
                                `}>
                                    {openerCategory === category && (
                                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                                    )}
                                </div>
                                <span className="text-amber-400 capitalize">{category}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Player Management */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-amber-500 mb-4 border-b border-amber-500/30 pb-2">
                        Add Players <span className="text-sm font-normal">({players.length}/{MAX_PLAYERS})</span>
                    </h2>

                    <div className="flex mb-4">
                        <input
                            onKeyDown={e => onInputKeyDown(e)}
                            value={currentPlayerName}
                            onChange={event => setCurrentPlayerName(event.target.value)}
                            className="flex-grow bg-gray-700 border-2 border-amber-500/50 focus:border-amber-500 text-amber-100 rounded-l-lg px-4 py-2.5 placeholder-amber-600/70 outline-none transition-all"
                            placeholder="Enter player name..."
                            type="text"
                            maxLength={20}
                        />
                        <button
                            disabled={!playerNameValid() || players.length >= MAX_PLAYERS}
                            className={`px-4 py-2.5 rounded-r-lg font-bold transition-all ${
                                playerNameValid() && players.length < MAX_PLAYERS
                                    ? 'bg-amber-600 hover:bg-amber-500 text-gray-900'
                                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            }`}
                            onClick={addPlayer}
                        >
                            Add
                        </button>
                    </div>

                    {/* Player List */}
                    {players.length > 0 && (
                        <div className="bg-gray-700/30 rounded-lg p-3 border border-amber-500/20">
                            <h3 className="text-amber-400 text-sm mb-2 uppercase tracking-wider font-bold">Players:</h3>
                            <ul className="space-y-2">
                                {players.map((player) => (
                                    <li key={player.id} className="flex items-center justify-between bg-gray-700/40 rounded-md p-2.5">
                                        <div className="flex items-center">
                                            <div className={`w-3 h-3 rounded-full bg-${player.color} mr-3`}></div>
                                            <span className={`text-${player.color} font-medium`}>{player.name}</span>
                                        </div>
                                        <button
                                            onClick={() => removePlayer(player.id)}
                                            className="text-gray-400 hover:text-red-400 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                    <button
                        disabled={!isGameValid()}
                        className={`w-full py-3 rounded-lg font-bold text-lg transition-all ${
                            isGameValid()
                                ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-gray-900 shadow-lg hover:shadow-amber-500/25'
                                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        }`}
                        onClick={onPlayClick}
                    >
                        {isGameValid() ? 'Begin Adventure' : 'Need at least 2 players'}
                    </button>

                    <button
                        className="w-full py-3 rounded-lg font-bold text-lg bg-indigo-700 hover:bg-indigo-600 text-white transition-all shadow-lg hover:shadow-indigo-500/25"
                        onClick={onQuickPlayClick}
                    >
                        Quick Play (2 Players)
                    </button>

                    <button
                        className="w-full py-2 rounded-lg font-medium bg-gray-700 hover:bg-gray-600 text-gray-300 transition-all"
                        onClick={testServerClick}
                    >
                        Test Server
                    </button>
                </div>
            </div>

            {/* Add a custom style tag for the font */}
            <style>{`
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
            `}</style>
        </div>
    );
};