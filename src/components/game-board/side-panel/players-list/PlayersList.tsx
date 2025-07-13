import React from 'react';

export type PlayerListProps = ChildProps & { players: Player[], activePlayer: Player | null }

export default function PlayersList({players, activePlayer, className}: PlayerListProps): React.JSX.Element {
    const isActive: (id: number) => boolean = (playerId) => playerId === activePlayer?.id;

    return (
        <div className={`${className} flex flex-col`}>
            <h2 className='text-lg font-bold text-amber-500 mb-4'>Players</h2>
            <ul className="space-y-3">
                {players.map((player) => {
                    return (
                        <li key={player.id} className={`flex items-center p-3 rounded-md ${isActive(player.id) ? 'bg-gray-700/40 border border-amber-500/30' : 'bg-gray-700/20'} transition-all duration-300 ease-in-out`}>
                            <div className={`w-3 h-3 rounded-full bg-${player?.color} mr-3 transition-all duration-300`}></div>
                            <span className={`text-${player?.color} ${isActive(player.id) ? 'font-bold' : 'font-medium'} transition-all duration-300`}>
                                {player.name}
                            </span>
                            <span className={`ml-auto text-amber-400 text-sm font-bold transition-opacity duration-300 ${isActive(player.id) ? 'opacity-100' : 'opacity-0'}`}>
                                Active
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}