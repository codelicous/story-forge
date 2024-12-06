import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import {Welcome} from './Welcome/Welcome';
import {GameOver} from './GameOver/GameOver.tsx';
import GameBoard from '@components/game-board/GameBoard';
import TestServer from '@components/app/test-server/test-server.tsx';

export const Views = (): React.JSX.Element => (
    <Routes>
        <Route path='/' element={<Welcome />} />
        <Route path='/welcome' element={<Welcome />} />
        <Route path='/test-server' element={<TestServer />} />
        <Route path='/quickplay' element={<GameBoard className='flex w-full h-full'/>} />
        <Route path='/game' element={<GameBoard className='flex w-full h-full'/>} />
        <Route path='/game-over' element={<GameOver />} />
        <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
);