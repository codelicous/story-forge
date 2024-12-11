import {useCallback, useState} from 'react';
import {initGame} from '../../../api.ts';
import {GameState} from '@components/app/consts.ts';


const gameStub: any = {
    activePlayerId: null,
    content: '',
    currentPlayerTime: 0,
    id: '',
    maxEntries: 0,
    name: '',
    nextPlayer: null,
    max_turn_seconds: 2,
    story: {
        entries: [],
        opener: ''
    },
    openerCategory: 'random',
    players: [1,2,3,4],
    starter: 'There was a special sale on Costco\'s saver meaty buns, yet Sherrill didn\'nt',
    state: GameState.Create,
    totalTurns: 8
};

export default function TestServer(): React.JSX.Element {
    let [wsContent, setWsContent] = useState('');
    let [isConnected, setIsConnected] = useState(false);
    let socket: WebSocket | null = null;
    let socketId: string;
    const initalizeGame = () => {
        socket?.send(JSON.stringify({
            message: 'initialize_game_session',
            payload: gameStub,
            socketId
        }));
        };
    const testGet = useCallback(async () => {
        const res = await fetch('/api');
        const json = await res.json();
        console.log(json);
    }, []);

    const testInit = useCallback(async () => {
        const res = await initGame({});
        console.log(res);
    }, [initGame]);

    const openWebSocket = useCallback(async () => {
        socket = new WebSocket('ws://localhost:8000/ws');
        socket.addEventListener('open', wsRes => {
            setWsContent('connection established');
            setIsConnected(true);
            listenToMessage();

            wsContent = wsRes.toString();

        })
    }, [initGame]);
    const sendWebSocketMessage = useCallback(async () => {
        socket?.send('hello')
    }, [])

    const listenToMessage = () => socket!.addEventListener('message', e => {
        let data;
        try {
            data = JSON.parse(e.data);
        } catch (e) {
            console.warn('invalid socket connection', e);
        }
        if ('socketId' in data) {
            socketId = data.socketId;
            initalizeGame();
        }
        console.log(e.data);
        setWsContent(e.data);
    });

    return (
        <>
            <button className='btn-active' onClick={testGet}>Init GamesTest</button>
            <button className='btn-active' onClick={testInit}>Init Game</button>
            <button className='btn-active' onClick={openWebSocket}>open Web Socket</button>
            <button className='btn-active' disabled={!isConnected} onClick={sendWebSocketMessage}>Send Web Socket
                Message
            </button>
            <div>Web Socket Content {wsContent}</div>
        </>);
}