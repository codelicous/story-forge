import React from 'react';
import PlayersList from './players-list/PlayersList';
import GameStatus from './game-status/GameStatus';

export type SidePanelProps = ChildProps & { 
    updatePlayerTurn: () => void; 
    endGame: () => void;
    game: ParsedGame;
    onBackToMenu: () => void;
};

function SidePanel({ className, updatePlayerTurn, endGame, game, onBackToMenu }: SidePanelProps): React.JSX.Element {

     return (
        <div className={`${className} flex flex-col h-full`}>
            <div className="bg-gray-700/30 rounded-lg m-4 mb-2">
                <GameStatus className="p-6" { ...game } updatePlayerTurn={ updatePlayerTurn }
                            endGame={ endGame }/>
            </div>
            <div className="bg-gray-700/30 rounded-lg m-4 mt-2 flex-1">
                <PlayersList className="p-6" players={ game.players } activePlayer={ game.activePlayer }/>
            </div>
            <div className="p-4">
                <button
                    onClick={ onBackToMenu }
                    className="w-full py-3 rounded-lg font-bold bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-gray-900 shadow-lg hover:shadow-amber-500/25 transition-all">
                    Back to Main Menu
                </button>
            </div>
        </div>
    );
}

export default SidePanel;
