# Tube Joint Visualization Desktop Application

An interactive desktop application built with Electron, React, TypeScript, and Three.js that enables users to create, visualize, and manipulate joints between rectangular/square tubes at various angles.

## Features

- 🎨 Interactive 3D visualization of rectangular and square tubes
- 🔧 Customizable tube parameters (width, height, thickness, length)
- 🔗 Joint creation and manipulation at various angles
- 🎯 Angle snapping (45°, 90°, 135°, custom)
- 👁️ Wireframe and solid view modes
- 🔄 Undo/redo functionality
- 🖱️ Drag, rotate, and position tubes interactively
- 🔍 Zoom, pan, and rotate workspace controls

## Technology Stack

- **Framework**: Electron (desktop packaging)
- **UI**: React + TypeScript
- **3D Visualization**: Three.js + React Three Fiber
- **Build Tool**: Vite
- **Packaging**: Electron Builder

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tube-joint-visualization-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run in development mode**
   ```bash
   npm run dev
   ```
   This will start the Vite dev server and launch the Electron app.

## Build Instructions

### Build for Development
```bash
npm run build
```
This builds the React app and Electron main/preload processes.

### Package Application
```bash
npm run build:electron
```
or
```bash
npm run dist
```

This will create a distributable executable in the `release` directory.

## Project Structure

```
Technical Challenge/
├── src/
│   ├── main/              # Electron main process
│   │   ├── main.ts        # Main entry point
│   │   └── preload.ts     # Preload script
│   ├── renderer/          # React app
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   ├── types/         # TypeScript type definitions
│   │   └── App.tsx        # Main React component
│   └── shared/            # Shared types/utilities
├── assets/                # Static assets
├── docs/                  # Documentation
├── public/                # Public assets
└── package.json
```

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run build:electron` - Package Electron app
- `npm run dist` - Create distributable executable

## Packaging Steps

See [docs/PACKAGING.md](docs/PACKAGING.md) for detailed packaging instructions.

## License

MIT

## Author

[Your Name]

