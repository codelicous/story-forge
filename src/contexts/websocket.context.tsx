import React, { createContext, useContext, useCallback, useEffect, useRef, useState, ReactNode } from 'react';
import { StoryEntry, useGame } from '@contexts/game.context.tsx';

interface WebSocketContextType {
    isConnected: boolean;
    connectionError: boolean;
    connectionTested: boolean;
    isTurnLoading: boolean;
    wsContent: Game | null;
    openWebSocket: () => void;
    closeWebSocket: () => void;
    sendMessage: (message: string) => void;
    initializeGame: () => void;
    passTurn: () => void;
    addEntry: (text: string, user: string) => void;
    clearLog: () => void;
    resetError: () => void;
    testConnection: () => void;
    disconnectAndCleanup: () => void;
}

// Type guard to validate Game object
const isValidGame = (data: unknown): data is Game => {
    return data !== null && 
           typeof data === 'object' &&
           data !== undefined &&
           'players' in data &&
           'openerCategory' in data &&
           Array.isArray((data as Record<string, unknown>).players) &&
           typeof (data as Record<string, unknown>).openerCategory === 'string' &&
           ['random', 'mystery', 'funny'].includes((data as Record<string, unknown>).openerCategory as string);
};

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
    const [wsContent, setWsContent] = useState<Game | null>(null);
    const { config } = useGame();

    const [isConnected, setIsConnected] = useState(false);
    const [connectionError, setConnectionError] = useState(false);
    const [connectionTested, setConnectionTested] = useState(false);
    const [isTurnLoading, setIsTurnLoading] = useState(false);
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
        setIsConnected(true);
        setConnectionError(false);
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
            initializeGame();
            return; // Don't set wsContent for socketId messages
        }
        if (!sessionIdRef.current && data && ('id' in data)) {
            sessionIdRef.current = data.id;
        }
        
        // Only set wsContent if data is a valid Game object
        if (isValidGame(data)) {
            setWsContent(data);
            // Turn loading completes when we receive new game data
            setIsTurnLoading(false);
        } else {
            console.warn('Received invalid game data:', data);
        }
    }, [initializeGame]);

    const handleClose = useCallback((event: CloseEvent) => {
        console.log('WebSocket closed:', event.code, event.reason);
        setIsConnected(false);
        if (event.code !== 1000) {
            setConnectionError(true);
        }
    }, []);

    const handleError = useCallback((error: Event) => {
        console.error('WebSocket error:', error);
        setConnectionError(true);
        setIsConnected(false);
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
        setIsTurnLoading(true);
        socketRef.current?.send(JSON.stringify({
            socketId: socketIdRef.current,
            message: 'end_current_turn',
            sessionId: sessionIdRef.current
        }));
    }, []);

    const addEntry = useCallback((text: string, user: string) => {
        setIsTurnLoading(true);
        const entry: StoryEntry = { text, user };
        socketRef.current?.send(socketPayload({ message: 'add_entry', entry }));
    }, [socketPayload]);

    const clearLog = useCallback(() => {
        setWsContent(null);
    }, []);

    const resetError = useCallback(() => {
        setConnectionError(false);
    }, []);

    const testConnection = useCallback(() => {
        // Create a temporary connection just to test connectivity
        const testSocket = new WebSocket('ws://localhost:8000/game/live');
        
        testSocket.addEventListener('open', () => {
            setIsConnected(true);
            setConnectionError(false);
            setConnectionTested(true);
            testSocket.close(1000, 'Connection test complete');
        });
        
        testSocket.addEventListener('error', () => {
            setConnectionError(true);
            setIsConnected(false);
            setConnectionTested(true);
        });
        
        testSocket.addEventListener('close', (event) => {
            if (event.code !== 1000) {
                setConnectionError(true);
                setIsConnected(false);
            }
            setConnectionTested(true);
        });
    }, []);

    const disconnectAndCleanup = useCallback(() => {
        // Close WebSocket connection if it exists
        if (socketRef.current) {
            removeSocketListeners(socketRef.current);
            if (socketRef.current.readyState === WebSocket.OPEN ||
                socketRef.current.readyState === WebSocket.CONNECTING) {
                socketRef.current.close(1000, 'Game ended');
            }
            socketRef.current = null;
        }
        
        // Reset all WebSocket state
        setWsContent(null);
        setIsConnected(false);
        setConnectionError(false);
        setConnectionTested(false);
        setIsTurnLoading(false);
        
        // Clear session data
        socketIdRef.current = '';
        sessionIdRef.current = '';
    }, [removeSocketListeners]);

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
        connectionError,
        connectionTested,
        isTurnLoading,
        wsContent,
        openWebSocket,
        closeWebSocket,
        sendMessage,
        initializeGame,
        passTurn,
        addEntry,
        clearLog,
        resetError,
        testConnection,
        disconnectAndCleanup
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};