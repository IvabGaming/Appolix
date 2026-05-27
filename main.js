// main.js
const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 950,
    height: 650,
    backgroundColor: '#000000',
    title: "Apollix System Core",
    webPreferences: {
      nodeIntegration: true,        
      contextIsolation: false,      
      preload: path.join(__dirname, 'preload.js')
    }
  });

  Menu.setApplicationMenu(null);
  mainWindow.loadFile('index.html');
}

// IPC Listener: Swaps the active window file view safely
ipcMain.on('change-view', (event, targetFile) => {
  if (mainWindow) {
    mainWindow.loadFile(targetFile);
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
