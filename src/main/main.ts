import { app, BrowserWindow } from 'electron';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
const distPath = join(__dirname, '../dist');
const publicPath = app.isPackaged
  ? distPath
  : join(distPath, '../public');
  
process.env.DIST = distPath;
process.env.VITE_PUBLIC = publicPath;

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, 'preload.js');
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const url = process.env.VITE_DEV_SERVER_URL;

function createWindow() {
  win = new BrowserWindow({
    width: 1400,
    height: 900,
    icon: join(publicPath, 'icon.png'),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge
      // See https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
  });

  // Set Content Security Policy based on environment
  // Development: Allows 'unsafe-eval' for Vite HMR
  // Production: Stricter policy without 'unsafe-eval'
  const isDevelopment = !app.isPackaged && url; // Development mode
  
  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    // Development CSP - allows 'unsafe-eval' for Vite HMR
    const developmentCSP = [
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "font-src 'self' data:; " +
      "connect-src 'self' http://localhost:* ws://localhost:* ws://127.0.0.1:*;"
    ];
    
    // Production CSP - stricter, no 'unsafe-eval'
    const productionCSP = [
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "font-src 'self' data:; " +
      "connect-src 'self';"
    ];
    
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': isDevelopment ? developmentCSP : productionCSP,
      },
    });
  });

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  if (url) {
    // electron-vite-vue#298
    win.loadURL(url);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(join(distPath, 'index.html'));
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);

