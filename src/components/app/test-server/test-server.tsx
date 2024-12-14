import {useCallback, useState} from 'react';
import {initGame} from '../../../api.ts';
import {GameState} from '@components/app/consts.ts';
import {StoryEntry} from '@contexts/game.context.tsx';


const gameStub: any = {
    activePlayerId: null,
    content: '',
    currentPlayerTime: 0,
    id: '',
    maxEntries: 0,
    name: '',
    nextPlayer: null,
    max_turn_seconds: 30,
    story: {
        entries: [],
        opener: ''
    },
    openerCategory: 'random',
    players: [1, 2, 3, 4],
    starter: 'There was a special sale on Costco\'s saver meaty buns, yet Sherrill didn\'nt',
    state: GameState.Create,
    totalTurns: 1
};

export default function TestServer(): React.JSX.Element {
    let [wsContent, setWsContent] = useState('');
    let [isConnected, setIsConnected] = useState(false);
    let socket: WebSocket | null = null;
    let socketId: string;
    let sessionId: string;
    const initializeGame = () => {
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
            console.log(wsRes);
            wsContent = wsRes.toString();

        })
    }, [initGame]);
    const sendWebSocketMessage = useCallback(async () => {
        socket?.send('hello');
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
            initializeGame();
        }
        if (!sessionId && ('id' in data)) {
            sessionId = data.id;
        }
        console.log(e.data);
        setWsContent(e.data);
    });
    const socketPayload = useCallback((payload = {}) => JSON.stringify({...payload, socketId, sessionId}), []);
    const passTurn = useCallback(async () => {
        socket?.send(JSON.stringify({socketId, message: 'end_current_turn', sessionId: sessionId}));
    }, [])
    const addEntry = useCallback(async () => {
        const entry: StoryEntry = { text: 'some_text', user: '1' }
        socket?.send(socketPayload({message: 'add_entry', entry}));
    }, [])
    return (
        <>
            <button className='btn-active' onClick={testGet}>Init GamesTest</button>
            <button className='btn-active' onClick={testInit}>Init Game</button>
            <button className='btn-active' onClick={openWebSocket}>open Web Socket</button>
            <button className='btn-active' onClick={passTurn}>Pass Turn</button>
            <button className='btn-active' onClick={addEntry}>Add Entry</button>
            <button className='btn-active' disabled={!isConnected} onClick={sendWebSocketMessage}>Send Web Socket
                Message
            </button>
            <div>Web Socket Content {wsContent}</div>
        </>);
}