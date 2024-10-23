import React, { createContext, useContext, ReactNode, useCallback, useState, useMemo, useRef } from 'react';

export interface TimerContextProps {
    timer: number;
    startCountdown: () => void;
    stopCountdown: () => void;
}

const TimerContext = createContext<TimerContextProps | undefined>(undefined);

export const useTimer = () => {
    const context = useContext(TimerContext);
    if (!context) {
        throw new Error('useTimer must be used within a TimerProvider');
    }
    return context;
};

export type TimerProviderProps = { children: ReactNode; initialTime: number; }

// TBD: Move to utils?
export const formatTime = (milliseconds: number): string => {
    // Outputs time in MM:SS format
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const TimerProvider: React.FC<TimerProviderProps> = ({ children, initialTime }) => {
    const [timer, setTimer] = useState(initialTime);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const stopCountdown = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    }, [intervalRef]);

    const startCountdown = useCallback(() => {
        stopCountdown();
        setTimer(initialTime);
        intervalRef.current = setInterval(() => {
            setTimer(prevTimer => {
                if (prevTimer <= 1) {
                    if (intervalRef.current) {
                        stopCountdown();
                        return 0;
                    }
                }
                return prevTimer - 100;
            });
        }, 100);

        return stopCountdown;
    }, [initialTime, stopCountdown]);

    const value = useMemo(() =>
            ({ timer, startCountdown, stopCountdown }),
        [timer, startCountdown, stopCountdown]);

    return (
        <TimerContext.Provider value={ value }>
            { children }
        </TimerContext.Provider>
    );
};
