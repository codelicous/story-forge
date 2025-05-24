import { useCallback, useEffect, useRef, useState } from 'react';
import { GameState } from '@components/app/consts.ts';
import { StoryEntry } from '@contexts/game.context.tsx';


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
    const [wsContent, setWsContent] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<WebSocket | null>(null);
    const socketIdRef = useRef<string>('');
    const sessionIdRef = useRef<string>('');

    const initializeGame = useCallback( async () => {
        socketRef.current?.send(JSON.stringify({
            message: 'initialize_game_session',
            payload: gameStub,
            socketId: socketIdRef.current,
        }));
    },[]);
    const testGet = useCallback(async () => {
        const res = await fetch('/api');
        const json = await res.json();
        console.log(json);
    }, []);

    const testInit = useCallback(async () => {
        const res = await initializeGame();
        console.log(res);
    }, [initializeGame]);

    const handleOpen = useCallback(() => {
        setWsContent('connection established');
        setIsConnected(true);
    }, []);
    const handleMessage =  useCallback((e: MessageEvent) => {
        let data;
        try {
            data = JSON.parse(e.data);
        } catch (err) {
            console.warn('invalid socket connection', err);
        }
        if ('socketId' in data) {
            socketIdRef.current = data.socketId;
            initializeGame();
        }
        if (!sessionIdRef.current && ('id' in data)) {
            sessionIdRef.current = data.id;
        }
        setWsContent(e.data);
    },[]);

    const handleClose = useCallback((event: CloseEvent) => {
        console.log('WebSocket closed:', event.code, event.reason);
        setIsConnected(false);
        setWsContent(`Connection closed: ${event.code} - ${event.reason || 'No reason provided'}`);
    }, []);

    const handleError = useCallback((error: Event) => {
        console.error('WebSocket error:', error);
        setWsContent('Connection error occurred');
    }, []);

    const openWebSocket = useCallback(async () => {
        // Close existing connection if any
        if (socketRef.current) {
            socketRef.current.removeEventListener('open', handleOpen);
            socketRef.current.removeEventListener('message', handleMessage);
            socketRef.current.removeEventListener('close', handleClose);
            socketRef.current.removeEventListener('error', handleError);

            if (socketRef.current.readyState === WebSocket.OPEN ||
                socketRef.current.readyState === WebSocket.CONNECTING) {
                socketRef.current.close(1000, 'Opening new connection');
            }
        }

        socketRef.current = new WebSocket('ws://localhost:8000/game/live');
        socketRef.current.addEventListener('open', handleOpen)
        socketRef.current.addEventListener('message', handleMessage);
        socketRef.current.addEventListener('close', handleClose);
        socketRef.current.addEventListener('error', handleError);
    }, [handleOpen, handleMessage, handleClose, handleError]);

    const sendWebSocketMessage = useCallback(async () => {
        socketRef.current?.send('opOpen');
    }, [])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (socketRef.current) {
                socketRef.current.removeEventListener('open', handleOpen);
                socketRef.current.removeEventListener('message', handleMessage);
                socketRef.current.removeEventListener('close', handleClose);
                socketRef.current.removeEventListener('error', handleError);

                if (socketRef.current.readyState === WebSocket.OPEN) {
                    socketRef.current.close(1000, 'Component unmounting');
                }
            }
        };
    }, [handleOpen, handleMessage, handleClose, handleError]);


    const socketPayload = useCallback((payload = {}) => JSON.stringify({
        ...payload,
        socketId: socketIdRef.current,
        sessionId: sessionIdRef.current
    }), []);
    const passTurn = useCallback(async () => {
        socketRef.current?.send(JSON.stringify({
            socketId: socketIdRef.current,
            message: 'end_current_turn',
            sessionId: sessionIdRef.current
        }));
    }, []);

    const addEntry = useCallback(async () => {
        const entry: StoryEntry = { text: 'some_text', user: '1' }
        socketRef.current?.send(socketPayload({ message: 'add_entry', entry }));
    }, []);

    const killSocket = useCallback(() => {
        if (socketRef.current) {
            console.log('here');
            // Send kill message first if connection is open
            socketRef.current.close(1000, 'Client initiated close');
        }
    }, []);
    const clearLog = useCallback(() => {
        setWsContent('')
    }, [])
    return (
        <>
            <button className='btn-active' onClick={ testGet }>Init GamesTest</button>
            <button className='btn-active' onClick={ testInit }>Init Game</button>
            <button className='btn-active' onClick={ openWebSocket }>open Web Socket</button>
            <button className='btn-active' onClick={ passTurn }>Pass Turn</button>
            <button className='btn-active' onClick={ addEntry }>Add Entry</button>
            <button className='btn-active' onClick={ killSocket }>Kill Socket</button>
            <button className='btn-active' disabled={ !isConnected } onClick={ sendWebSocketMessage }>Send Web Socket
                Message
            </button>
            <button className='btn-active' onClick={ clearLog }>Clear Log</button>
            <div>Web Socket Content { wsContent }</div>
        </>);
}