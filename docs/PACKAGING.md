# Packaging Instructions

This document provides step-by-step instructions for packaging the Tube Joint Visualization application into a standalone executable.

## Prerequisites

1. Ensure all dependencies are installed:
   ```bash
   npm install
   ```

2. Verify the application runs correctly in development mode:
   ```bash
   npm run dev
   ```

## Packaging Steps

### Step 1: Build the Application

First, build the React renderer and Electron main/preload processes:

```bash
npm run build
```

This will:
- Compile TypeScript files
- Build the React application
- Build the Electron main and preload scripts
- Output files to `dist/` and `dist-electron/` directories

### Step 2: Package the Electron App

Run the packaging command:

```bash
npm run build:electron
```

or

```bash
npm run dist
```

This will:
- Use electron-builder to package the application
- Create platform-specific installers/executables
- Output files to the `release/` directory

### Step 3: Locate the Executable

After packaging completes, navigate to the `release` directory:

**Windows:**
- The executable will be in `release/Tube Joint Visualization Setup X.X.X.exe` (NSIS installer)
- Or `release/win-unpacked/Tube Joint Visualization.exe` (unpacked version)

**macOS:**
- The application bundle will be in `release/mac/Tube Joint Visualization.app`

**Linux:**
- The AppImage or deb/rpm package will be in `release/`

### Step 4: Test the Packaged Application

1. Run the executable/installer
2. Verify all features work correctly:
   - 3D visualization loads
   - Tube creation and manipulation
   - Joint detection and preview
   - All UI controls function properly
   - No console errors

## Troubleshooting

### Build Fails

- Ensure all dependencies are installed: `npm install`
- Check Node.js version (requires v18+)
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Executable Doesn't Run

- Check that all assets are included in the build
- Verify electron-builder configuration in `package.json`
- Check the build logs for errors

### Missing Assets

- Ensure all static assets are in the `public/` directory
- Check `electron-builder.json` configuration includes necessary files

## Distribution

Once packaged, you can:
1. Upload the executable to Google Drive or other file sharing service
2. Share the download link
3. Include the link in your submission email

## Notes

- The first build may take longer as electron-builder downloads platform-specific tools
- Subsequent builds will be faster
- Ensure you have sufficient disk space (packaged app can be 100-200MB)

