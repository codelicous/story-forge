import React from 'react';
import PlayersList from './players-list/PlayersList';
import GameStatus from './game-status/GameStatus';

export type SidePanelProps = ChildProps & { game: Game, updatePlayerTurn: () => void, endGame: () => void };

function SidePanel({className, game, updatePlayerTurn, endGame}: SidePanelProps): React.JSX.Element {
    return (<>
            <div className={className}>
            <GameStatus className="flex basis-2/3 p-5 border-2" {...game} updatePlayerTurn={updatePlayerTurn} endGame={endGame}/>
            <PlayersList className="flex flex-1 p-5 border-2" players={game.players} activePlayer={game.activePlayer}/>
            </div>
    </>);
}

export default SidePanel;
