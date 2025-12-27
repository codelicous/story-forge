# GEMINI.MD

This file provides guidance for the Gemini CLI agent when working with this repository.

## Overview

Three Words is a multiplayer storytelling game built with React, TypeScript, and Vite. Players collaborate to build a story by adding 3-10 words at a time. The game state is managed via React Context and synchronized through WebSockets.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, DaisyUI, Classnames
- **Routing:** React Router DOM v6
- **State Management:** React Context (Game and WebSocket contexts)
- **Networking:** WebSockets (connecting to `ws://localhost:8000/game/live`)
- **Linting:** ESLint with strict TypeScript rules

## Project Structure

- `src/components`: UI components organized by feature.
- `src/contexts`: Global state management.
  - `game.context.tsx`: Local game configuration and story state.
  - `websocket.context.tsx`: Handles communication with the game server.
- `src/views`: Top-level page components (Welcome, LobbyRoom, GameBoard, GameOver).
- `src/types`: TypeScript definitions.

## Key Concepts

### Game State
The game state is primarily driven by the server via WebSockets. The `wsContent` in `WebSocketProvider` contains the current `Game` object, which includes:
- `players`: List of players in the session.
- `activePlayer`: The player whose turn it is.
- `story`: The current story entries and opener.
- `currentPlayerTime`: Current time elapsed in the active turn.
- `state`: Current game state (LOBBY, STARTED, COMPLETED, etc.).

### Navigation Flow
1. **Welcome**: User enters their name and joins or creates a game.
2. **LobbyRoom**: Waiting for players and configuring game settings (opener category).
3. **GameBoard**: The main gameplay loop.
4. **GameOver**: Final story display and option to restart.

## Development Best Practices

- **Type Safety**: Always use the defined interfaces in `src/types/types.d.ts`. Avoid `any`.
- **Component Patterns**: 
  - Prefer functional components with hooks.
  - Use `classnames` for conditional Tailwind classes.
  - Keep components modular and focused.
- **State Management**: 
  - Use `useGame()` for local UI state and config.
  - Use `useWebSocket()` for server-synchronized state.
- **Styling**: Use Tailwind CSS utility classes. Leverage DaisyUI components for consistent UI elements (modals, buttons, etc.).
- **Async Operations**: Handle WebSocket events and API calls gracefully, including error states.

## Common Tasks

- **Adding a Component**: Create a new directory in `src/components` with `.tsx` and `.css` files.
- **Modifying Game Logic**: Most logic resides on the server, but client-side updates happen in `src/contexts/websocket.context.tsx` and `src/contexts/game.context.tsx`.
- **Styling Changes**: Update Tailwind classes in components or modify `tailwind.config.js`.

## WebSocket Communication

The client and server communicate using JSON messages over WebSockets. Key message types include:

- `initialize_game_session`: Sets up a new game session with current configuration.
- `open_room`: Opens the game room for others to join.
- `add_entry`: Adds a new story segment (3-10 words).
- `pass_turn`: Skips the current player's turn.

The `WebSocketProvider` in `src/contexts/websocket.context.tsx` handles these interactions and maintains the `wsContent` state.

## Recent Findings
- `CLAUDE.MD` mentions a `timer.context.tsx` which does not currently exist in the `src` directory. Timer data is currently part of the `Game` object received via WebSockets (`currentPlayerTime`).
- The project uses path aliases (e.g., `@components`, `@contexts`) defined in `vite.config.ts` and `tsconfig.json`.
- Game configuration includes `openerCategory` which can be `'random'`, `'mystery'`, or `'funny'`.
- A `ParsedGame` interface in `src/types/types.d.ts` provides stricter types for active game states.
