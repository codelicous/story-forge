import React from 'react';
import { useWebSocket } from '@contexts/websocket.context.tsx';

export default function TestServer(): React.JSX.Element {
    const { 
        isConnected, 
        wsContent, 
        openWebSocket, 
        closeWebSocket, 
        sendMessage, 
        initializeGame, 
        passTurn, 
        addEntry, 
        clearLog 
    } = useWebSocket();

    const testGet = async () => {
        const res = await fetch('/api');
        const json = await res.json();
        console.log(json);
    };

    const testInit = () => {
        initializeGame();
        console.log('Game initialization triggered');
    };

    const sendWebSocketMessage = () => {
        sendMessage('open');
    };

    const handleAddEntry = () => {
        addEntry('some_text', '1');
    };

    return (
        <>
            <button className='btn-active' onClick={testGet}>Init GamesTest</button>
            <button className='btn-active' onClick={testInit}>Init Game</button>
            <button className='btn-active' onClick={openWebSocket}>open Web Socket</button>
            <button className='btn-active' onClick={passTurn}>Pass Turn</button>
            <button className='btn-active' onClick={handleAddEntry}>Add Entry</button>
            <button className='btn-active' onClick={closeWebSocket}>Kill Socket</button>
            <button className='btn-active' disabled={!isConnected} onClick={sendWebSocketMessage}>Send Web Socket Message</button>
            <button className='btn-active' onClick={clearLog}>Clear Log</button>
            <div>Web Socket Content: {wsContent}</div>
        </>
    );
}