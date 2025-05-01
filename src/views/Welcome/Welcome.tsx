import React, { useCallback, useState } from 'react';
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
    const onPlayClick = useCallback(() => {
        navigate('/game');
    }, [players, navigate]);
    const onQuickPlayClick = useCallback(async () => {
        setConfig((prevState) => ({ ...prevState, players: quickPlayPlayers }));
        navigate('/quickplay');
    }, [navigate, setConfig]);

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

    return (
        <div className="form-control max-w-xs mx-auto gap-4">
            <img src='src/assets/story_forge.png' alt=''></img>
            <label>
                <p>Select a story category</p>
                { categories.map((category) => (
                    <label key={ category } className="label cursor-pointer">
                        <span className="label-text capitalize">{ category }</span>
                        <input checked={ openerCategory === category } onChange={ onCategoryChange } type="radio"
                               name="category" value={ category } className="radio checked:bg-black-500"/>
                    </label>
                )) }
            </label>

            <label className="input input-bordered flex items-center gap-2">

                <input value={ currentPlayerName } onChange={ event => setCurrentPlayerName(event.target.value) }
                       className="grow" placeholder="Name" type="text"/>
                { players.length <= MAX_PLAYERS &&
                    <button
                        disabled={ !playerNameValid() }
                        className="btn btn-primary"
                        onClick={ addPlayer }>Add Player</button> }
            </label>
            { players.length ? <div className='font-bold text-2xl'>Players:</div> : ''}
            {
                players.map((player, index) => (
                    <div key={ player.id } className={ `text-${playerColors[index + 1]} flex items-center gap-2 text-2xl`}>
                        { player.name }
                    </div>
                ))
            }
            <div className='flex flex-1' title={ !isGameValid() && 'At Least two players are needed' || '' }>
                <button disabled={ !isGameValid() } className="btn btn-primary flex-1" type="submit"
                        onClick={ onPlayClick }>
                    Play
                </button>
            </div>
            <button className="btn btn-primary" type="submit" onClick={ onQuickPlayClick }>
                Quick Play (2 Players)
            </button>
        </div>
    );
};