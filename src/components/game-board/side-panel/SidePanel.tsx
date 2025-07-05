import React from 'react';
import { useNavigate } from 'react-router-dom';
import PlayersList from './players-list/PlayersList';
import GameStatus from './game-status/GameStatus';

export type SidePanelProps = ChildProps & { game: Game, updatePlayerTurn: () => void, endGame: () => void };

function SidePanel({ className, game, updatePlayerTurn, endGame }: SidePanelProps): React.JSX.Element {
    const navigate = useNavigate();

    const handleBackToMenu = () => {
        navigate('/');
    };

    return (<>
        <div className={ className }>
            <GameStatus className="flex basis-2/3 p-5" { ...game } updatePlayerTurn={ updatePlayerTurn }
                        endGame={ endGame }/>
            <PlayersList className="flex flex-1 p-5" players={ game.players } activePlayer={ game.activePlayer }/>
            <div className="p-5">
                <button
                    onClick={ handleBackToMenu }
                    className="btn btn-primary btn-sm w-full">
                    Back to Main Menu
                </button>
            </div>
        </div>
    </>);
}

export default SidePanel;
