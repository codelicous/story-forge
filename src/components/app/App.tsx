import './App.css';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Views } from '../../views/views';
import { GameProvider } from '@contexts/game.context';

function App(): React.JSX.Element {
  return (
      <BrowserRouter basename="/">
          <GameProvider>
              <Views/>
          </GameProvider>
      </BrowserRouter>
  );
}

export default App;
