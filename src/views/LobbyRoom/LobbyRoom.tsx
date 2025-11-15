import React, { useCallback, useState } from 'react';
import { CategorySelection } from '@components/CategorySelection/CategorySelection';

type RoomStatus = 'offline' | 'waiting other players';

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 5;

export const LobbyRoom = (): React.JSX.Element => {
    const [roomStatus, setRoomStatus] = useState<RoomStatus>('offline');
    const [numberOfPlayers, setNumberOfPlayers] = useState<number | ''>('');
    const [playerName, setPlayerName] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('random');

    const isNumberOfPlayersValid = useCallback(() => {
        return numberOfPlayers !== '' && numberOfPlayers >= MIN_PLAYERS && numberOfPlayers <= MAX_PLAYERS;
    }, [numberOfPlayers]);

    const isPlayerNameValid = useCallback(() => {
        return playerName.trim().length >= 3 && playerName.trim().length <= 20;
    }, [playerName]);

    const isFormValid = useCallback(() => {
        return isNumberOfPlayersValid() && isPlayerNameValid() && selectedCategory !== '';
    }, [isNumberOfPlayersValid, isPlayerNameValid, selectedCategory]);

    const onCreateRoomClick = useCallback(() => {
        console.log('Create Room clicked', { numberOfPlayers, playerName: playerName.trim(), category: selectedCategory });
    }, [numberOfPlayers, playerName, selectedCategory]);

    const handleNumberOfPlayersChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value === '') {
            setNumberOfPlayers('');
        } else {
            const numValue = parseInt(value, 10);
            if (!isNaN(numValue)) {
                setNumberOfPlayers(numValue);
            }
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-6 md:py-12 px-4">
            <div className="max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8 lg:p-10">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-medieval text-amber-500 mb-4 text-center">
                    Lobby Room
                </h1>

                <div className="mb-6">
                    <div className="bg-gray-700/50 rounded-lg p-4">
                        <h2 className="text-lg md:text-xl font-bold text-amber-500 mb-2">
                            Room status:
                        </h2>
                        <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${roomStatus === 'offline' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                            <span className={`text-lg font-medium ${roomStatus === 'offline' ? 'text-red-400' : 'text-amber-400'}`}>
                                {roomStatus}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-lg md:text-xl font-bold text-amber-500 mb-4">
                        Room Configuration
                    </h2>

                    <div className="mb-4">
                        <label className="block text-amber-400 text-sm font-medium mb-2">
                            Your Name
                        </label>
                        <input
                            type="text"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            maxLength={20}
                            className="w-full bg-gray-700 border-2 border-amber-500/50 focus:border-amber-500 text-amber-400 rounded-lg px-4 py-2.5 placeholder-amber-400/70 outline-none transition-all"
                            placeholder="Enter your name (3-20 characters)"
                        />
                        {playerName.length > 0 && !isPlayerNameValid() && (
                            <p className="text-red-400 text-sm mt-1">
                                Name must be between 3 and 20 characters
                            </p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-amber-400 text-sm font-medium mb-2">
                            Number of Players ({MIN_PLAYERS}-{MAX_PLAYERS})
                        </label>
                        <input
                            type="number"
                            min={MIN_PLAYERS}
                            max={MAX_PLAYERS}
                            value={numberOfPlayers}
                            onChange={handleNumberOfPlayersChange}
                            className="w-full bg-gray-700 border-2 border-amber-500/50 focus:border-amber-500 text-amber-400 rounded-lg px-4 py-2.5 placeholder-amber-400/70 outline-none transition-all"
                            placeholder={`Enter number of players (${MIN_PLAYERS}-${MAX_PLAYERS})`}
                        />
                        {numberOfPlayers !== '' && !isNumberOfPlayersValid() && (
                            <p className="text-red-400 text-sm mt-1">
                                Please enter a number between {MIN_PLAYERS} and {MAX_PLAYERS}
                            </p>
                        )}
                    </div>
                </div>

                <CategorySelection selectedCategory={selectedCategory} onChange={setSelectedCategory} />

                <div className="space-y-3">
                    <button
                        disabled={!isFormValid()}
                        className={`w-full py-3 rounded-lg font-bold text-lg transition-all ${
                            isFormValid()
                                ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-gray-900 shadow-lg hover:shadow-amber-500/25'
                                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        }`}
                        onClick={onCreateRoomClick}
                    >
                        {isFormValid() ? 'Create Room' : 'Fill in room details to continue'}
                    </button>
                </div>
            </div>

            {/* Add a custom style tag for the font */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap');

                .font-medieval {
                    font-family: 'MedievalSharp', cursive;
                }
            `}</style>
        </div>
    );
};