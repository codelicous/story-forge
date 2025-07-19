import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidePanel from './side-panel/SidePanel';
import StoryBoard from './story-board/StoryBoard';
import { StartGameDialog } from '@components/app/game-board/start-game-dialog/StartGameDialog';

import { useWebSocket } from '@contexts/websocket.context.tsx';
import { useGame } from '@contexts/game.context.tsx';

function GameBoard({ className }: ChildProps): React.JSX.Element {

    const navigate = useNavigate();
    const { openWebSocket, wsContent, connectionError, passTurn, testConnection, connectionTested, isTurnLoading, disconnectAndCleanup } = useWebSocket();
    const { resetGame, config } = useGame();

    const isGameDataComplete = (game: Game): boolean => {
        return game.currentPlayerTime !== undefined &&
            game.maxEntries !== undefined &&
            game.totalTurns !== undefined &&
            game.activePlayerId !== null &&
            game.players.length > 0;
    };

    const parseGameData = (game: Game): ParsedGame | null => {
        if (!isGameDataComplete(game) || !game.activePlayerId) return null;
        const activePlayerIndex = game.players.findIndex(p => p.id === game.activePlayerId?.id);
        if (activePlayerIndex === -1) return null;

        const nextPlayerIndex = (activePlayerIndex + 1) % game.players.length;

        return {
            ...game,
            activePlayer: game.activePlayerId,
            nextPlayer: game.players[nextPlayerIndex],
            currentPlayerTime: game.currentPlayerTime!,
            totalTurns: game.totalTurns!,
            maxEntries: game.maxEntries!
        };
    };

    const [showGameDialog, setShowGameDialog] = useState(true);

    const okDialogAction = useCallback(() => {
        setShowGameDialog(false);
        openWebSocket();
    }, [setShowGameDialog, openWebSocket]);

    // Test connection on component mount to detect errors early
    React.useEffect(() => {
        testConnection();
    }, [testConnection]);

    const handleBackToMenu = useCallback(() => {
        resetGame();
        disconnectAndCleanup();
        navigate('/');
    }, [resetGame, disconnectAndCleanup, navigate]);

    const setEndGame = useCallback(() => {
        // Close WebSocket connection but keep game data for game-over screen
        disconnectAndCleanup();
        navigate('/game-over');
    }, [disconnectAndCleanup, navigate]);

    // Player turn updates are now handled by WebSocket

    const updatePlayerTurn = useCallback(() => {
        passTurn();
    }, [passTurn]);

    // Game initialization is now handled by WebSocket

    // Parse WebSocket game data if available and complete
    const parsedGame = wsContent ? parseGameData(wsContent) : null;

    return (
        <div className={ `w-full h-screen bg-gradient-to-b from-gray-900 to-gray-800 ${ className }` }>
            { !connectionTested ? (
                <div className='flex items-center justify-center w-full h-full'>
                    <div className='text-lg text-amber-400'>Connecting to server...</div>
                </div>
            ) : connectionError ? (
                <div className='flex items-center justify-center w-full h-full'>
                    <div
                        className='flex flex-col align-middle items-center p-8 rounded-xl bg-gray-800 border border-red-500/30 shadow-2xl max-w-md mx-auto'>
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-red-400 mb-2">
                                Connection Failed
                            </h2>
                            <div
                                className="w-16 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto"></div>
                        </div>

                        <div className="text-center mb-8 bg-gray-700/30 rounded-lg p-6 w-full">
                            <div className="text-red-300 text-lg mb-2">
                                Unable to connect to game server
                            </div>
                            <div className="text-red-200/80 text-sm">
                                Please check your connection and try again
                            </div>
                        </div>

                        <button
                            className='w-full py-3 rounded-lg font-bold text-lg bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-lg hover:shadow-red-500/25 transition-all duration-200'
                            onClick={ handleBackToMenu }
                        >
                            Back to Main Menu
                        </button>
                    </div>
                </div>
            ) : parsedGame ? (
                <div className="flex w-full h-full">
                    <SidePanel className='w-1/3 bg-gray-800/80 border-r border-amber-500/20'
                               endGame={ setEndGame }
                               updatePlayerTurn={ updatePlayerTurn }
                               game={ parsedGame }
                               onBackToMenu={ handleBackToMenu }>
                    </SidePanel>
                    <StoryBoard className='w-2/3 bg-gray-800/60'
                                game={ parsedGame }
                                updatePlayerTurn={ updatePlayerTurn }
                                isTurnLoading={ isTurnLoading }>
                    </StoryBoard>
                </div>
            ) : (
                <div className='flex items-center justify-center w-full h-full'>
                    <div className='text-lg text-amber-400'>Loading game data...</div>
                </div>
            ) }
            <StartGameDialog
                triggerStartGame={ okDialogAction }
                isOpen={ showGameDialog && connectionTested && !connectionError }
                startingPlayerName={ config.players[0]?.name || '' }/>
        </div>
    );
}

export default GameBoard;
