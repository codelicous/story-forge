import React, { createContext, useContext, useCallback, useEffect, useRef, useState, ReactNode } from 'react';
import { StoryEntry, useGame } from '@contexts/game.context.tsx';

interface WebSocketContextType {
    isConnected: boolean;
    wsContent: string;
    openWebSocket: () => void;
    closeWebSocket: () => void;
    sendMessage: (message: string) => void;
    initializeGame: () => void;
    passTurn: () => void;
    addEntry: (text: string, user: string) => void;
    clearLog: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (context === undefined) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};

interface WebSocketProviderProps {
    children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
    const [wsContent, setWsContent] = useState('');
    const { config } = useGame();

    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<WebSocket | null>(null);
    const socketIdRef = useRef<string>('');
    const sessionIdRef = useRef<string>('');

    const initializeGame = useCallback(() => {
        socketRef.current?.send(JSON.stringify({
            message: 'initialize_game_session',
            payload: config,
            socketId: socketIdRef.current,
        }));
    }, [config]);

    const handleOpen = useCallback(() => {
        setWsContent('connection established');
        setIsConnected(true);
    }, []);

    const handleMessage = useCallback((event: MessageEvent) => {
        const messageData = typeof event.data === 'string' ? event.data : event.data.toString();
        let data;
        try {
            data = JSON.parse(messageData);
        } catch (err) {
            console.warn('invalid socket connection', err);
        }
        // socketId is sent only in the first payload to message listener
        if (data && 'socketId' in data) {
            socketIdRef.current = data.socketId;
            console.info('initializing game', data);
            initializeGame();
        }
        if (!sessionIdRef.current && data && ('id' in data)) {
            sessionIdRef.current = data.id;
        }
        setWsContent(messageData);
    }, [initializeGame]);

    const handleClose = useCallback((event: CloseEvent) => {
        console.log('WebSocket closed:', event.code, event.reason);
        setIsConnected(false);
        setWsContent(`Connection closed: ${event.code} - ${event.reason || 'No reason provided'}`);
    }, []);

    const handleError = useCallback((error: Event) => {
        console.error('WebSocket error:', error);
        setWsContent('Connection error occurred');
    }, []);

    const removeSocketListeners = useCallback((socketRefCurrentInstance: WebSocket) => {
        socketRefCurrentInstance.removeEventListener('open', handleOpen);
        socketRefCurrentInstance.removeEventListener('message', handleMessage);
        socketRefCurrentInstance.removeEventListener('close', handleClose);
        socketRefCurrentInstance.removeEventListener('error', handleError);
    }, [handleOpen, handleMessage, handleClose, handleError]);

    const initializeConnectionAndListeners = useCallback( () => {
        socketRef.current = new WebSocket('ws://localhost:8000/game/live');
        socketRef.current.addEventListener('open', handleOpen);
        socketRef.current.addEventListener('message', handleMessage);
        socketRef.current.addEventListener('close', handleClose);
        socketRef.current.addEventListener('error', handleError);
    }, [handleOpen, handleMessage, handleClose, handleError]);

    const openWebSocket = useCallback(() => {
        // Close existing connection if any
        if (socketRef.current) {
            removeSocketListeners(socketRef.current);
            if (socketRef.current.readyState === WebSocket.OPEN ||
                socketRef.current.readyState === WebSocket.CONNECTING) {
                socketRef.current.close(1000, 'Opening new connection');
            }
        }
        initializeConnectionAndListeners();
    }, [initializeConnectionAndListeners, removeSocketListeners]);

    const closeWebSocket = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.close(1000, 'Client initiated close');
        }
    }, []);

    const sendMessage = useCallback((message: string) => {
        socketRef.current?.send(message);
    }, []);

    const socketPayload = useCallback((payload = {}) => JSON.stringify({
        ...payload,
        socketId: socketIdRef.current,
        sessionId: sessionIdRef.current
    }), []);

    const passTurn = useCallback(() => {
        socketRef.current?.send(JSON.stringify({
            socketId: socketIdRef.current,
            message: 'end_current_turn',
            sessionId: sessionIdRef.current
        }));
    }, []);

    const addEntry = useCallback((text: string, user: string) => {
        const entry: StoryEntry = { text, user };
        socketRef.current?.send(socketPayload({ message: 'add_entry', entry }));
    }, [socketPayload]);

    const clearLog = useCallback(() => {
        setWsContent('');
    }, []);

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

    const value: WebSocketContextType = {
        isConnected,
        wsContent,
        openWebSocket,
        closeWebSocket,
        sendMessage,
        initializeGame,
        passTurn,
        addEntry,
        clearLog
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};