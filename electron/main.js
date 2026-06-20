import { app, BrowserWindow, screen } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  const windowWidth = 350;
  const windowHeight = 600;
  
  // Position it in the bottom right corner
  const x = width - windowWidth - 20; // 20px padding from right
  const y = height - windowHeight - 20; // 20px padding from bottom

  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x,
    y,
    frame: false, // frameless widget
    transparent: true,
    alwaysOnTop: false, // DO NOT keep it on top of other apps
    type: 'desktop', // Try to keep it pinned to the desktop layer
    resizable: true,
    minWidth: 300,
    minHeight: 400,
    skipTaskbar: true, // doesn't show in taskbar
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
  
  // Make it so clicking through transparent areas works on some OS, but typically we want it solid widget.
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
