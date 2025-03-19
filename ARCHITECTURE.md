# HP AI Challenge - Application Architecture

## Overview

The HP AI Challenge is a React-based web application designed to provide interactive AI learning experiences through a series of challenges. The application follows a modular architecture with a central challenge hub and individual challenge components.

## Project Structure

```
src/
├── components/           # UI components
│   ├── challenges/       # Challenge components
│   ├── shared/           # Reusable components
│   ├── layout/           # Layout components
│   └── hub/              # Challenge hub components
├── stores/               # State management
├── data/                 # Static data definitions
├── types/                # TypeScript interfaces
├── utils/                # Helper functions
├── styles/               # Global styling
└── App.tsx               # Main application component
```

## Core Technologies

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS for utility classes with custom components 
- **Routing**: React Router v6
- **State Management**: Zustand for global state
- **UI Icons**: Lucide React for consistent iconography
- **Build Tool**: Vite for fast development and optimized production builds

## Key Components

The application is structured around these main components:

1. **Challenge Hub**: Central navigation hub for selecting challenges
2. **Challenge Components**: Individual challenge implementations
3. **Shared Components**: Reusable UI elements for consistent experience
4. **Layout Components**: Structural elements like header and navigation
5. **Profile Components**: User progress tracking and visualization

## State Management

The application uses Zustand for global state management with these main stores:

1. **heroStore**: Tracks user progress, completed challenges, and rewards
2. **uiStore**: Manages UI state like modals and theme preferences
3. **challengeStore**: Contains challenge metadata and completion status

## Routing Structure

```
/                     # Challenge Hub (main page)
/challenge/:id        # Individual challenge routes
/profile              # User profile and progress
/skill-tree           # Skill visualization
/building-blocks      # Final project builder
```

## Build and Deployment

The application uses Vite for development and production builds, with these scripts:

- `npm run dev`: Start development server
- `npm run build`: Create production build
- `npm run preview`: Preview production build locally

## Performance Considerations

1. **Code Splitting**: Each challenge loads independently
2. **Lazy Loading**: Components load on demand
3. **Asset Optimization**: Images and resources are optimized
4. **State Management**: Efficient updates with minimal re-renders

See the individual documentation files for detailed information on specific components and features. 