const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 950,
    height: 650,
    backgroundColor: '#000000',
    title: "Unix V7 HTML Simulator",
    icon: path.join(__dirname, 'icon.png'), // Optional application icon shortcut
    webPreferences: {
      nodeIntegration: true,        // Critical: Grants shell.js direct access to physical fs tools
      contextIsolation: false,      // Allows modular scripts to cross-communicate natively
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Remove the standard modern window menu bar to preserve the retro terminal aesthetic
  Menu.setApplicationMenu(null);

  // Load your physical user interface layer
  mainWindow.loadFile('index.html');

  // Developer Tool Toggle: Uncomment the line below if you want to inspect layout issues live
  // mainWindow.webContents.openDevTools();
}

// Spin up the app window once Electron finishes tracking initialization hooks
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Cleanly kill background processes when windows close across Mac, Windows, and Linux
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
