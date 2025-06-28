# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Three Words is a React-based multiplayer storytelling game where players take turns adding words to build a collaborative story. The project uses modern React with TypeScript, Vite for build tooling, and Tailwind CSS with DaisyUI for styling.

## Development Commands

- `npm run dev` - Start development server with Vite
- `npm run build` - Build for production (runs TypeScript compiler then Vite build)
- `npm run lint` - Run ESLint to check code quality
- `npm run lintfix` - Run ESLint with auto-fix
- `npm run preview` - Preview production build locally

## Project Structure

The application follows a React component-based architecture:

### Core Architecture
- **App.tsx**: Main application component with routing and context providers
- **Contexts**: React Context for global state management
  - `game.context.tsx` - Game state, story management, and player configuration
  - `timer.context.tsx` - Turn timer functionality
- **Views**: Route-based page components (Welcome, GameBoard, GameOver, TestServer)
- **Components**: Reusable UI components organized by feature

### Key Components
- **GameBoard**: Main game interface with SidePanel and StoryBoard
- **StoryBoard**: Story display and text input area
- **SidePanel**: Game status, player list, and controls
- **StartGameDialog**: Modal for initializing game sessions

### State Management
The application uses React Context for state management:
- Game state includes players, story entries, active player, turn management
- Timer context handles turn timing with configurable duration
- Story state tracks opener and player entries

## Technical Details

### Build Configuration
- Uses Vite with React SWC plugin for fast builds
- Path aliases configured for clean imports (@components, @contexts, @assets, @types, @utils)
- Proxy configuration routes `/api` requests to `http://127.0.0.1:8001`

### Code Style
- ESLint configuration enforces single quotes, semicolons, no unused imports
- Styled with Tailwind CSS and DaisyUI component library
- TypeScript with strict configuration

### Game Logic
- Turn-based gameplay with configurable timer (default 50 seconds)
- Players take turns adding 3-10 words to the story
- Game ends after maximum entries or turns are reached
- Story opener categories: random, mystery, funny

## WebSocket Integration

The application includes WebSocket functionality for real-time multiplayer features, with a test server component for development and debugging.