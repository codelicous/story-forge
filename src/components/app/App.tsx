import './App.css';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Views } from '../../views/views';
import { GameProvider } from '@contexts/game.context';
import { WebSocketProvider } from '@contexts/websocket.context.tsx';

export default function App(): React.JSX.Element {
  return (
      <BrowserRouter basename="/">
          <GameProvider>
              <WebSocketProvider>
                  <Views/>
              </WebSocketProvider>
          </GameProvider>
      </BrowserRouter>
  );
}