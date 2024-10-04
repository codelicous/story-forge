import * as React from "react";
import SidePanel from "./side-panel/SidePanel.tsx";
import StoryBoard from "./story-board/StoryBoard.tsx";
import {GameState} from "../consts.ts";
import {useEffect} from "react";

function GameBoard({ className }: ChildProps): React.JSX.Element{
    // TODO: Is this something we want to create in a class?
    const game: Game = {
        content: "",
        starter: 'This is how the story starts',
        players: [{id: 'gay', name: 'Tom'}, {id: 'no_gay', name: 'Ofer'}],
        state: GameState.InGame,
        timePerTurn: 0,
        totalGameTime: 0
    };
    useEffect(() => { // WHY? For socket/server communication?
        if (game.starter != null) {
            // TODO: Starter should come from either a dictionary, an AI...
            game.content = game.starter;
        }
    }, []);
    return (<div className= {className}>
            <SidePanel className="flex flex-4" game={game}></SidePanel>
            <StoryBoard className="flex flex-2 max-2xl board-container flex-col" game={game}></StoryBoard>
    </div>)
}

export default GameBoard;