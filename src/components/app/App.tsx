import './App.css';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Views } from '../../views/views';
import { GameProvider } from '@contexts/game.context';
import { TimerProvider } from '@contexts/timer.context.tsx';
import { TURN_TIME } from '@components/app/consts.ts';
import {RouteProvider} from '@contexts/router.context.tsx';

export default function App(): React.JSX.Element {
  return (
      <BrowserRouter basename="/">
        <RouteProvider>
          <GameProvider>
              <TimerProvider initialTime ={TURN_TIME} >
              <Views/>
              </TimerProvider>
          </GameProvider>
        </RouteProvider>
      </BrowserRouter>
  );
}