// bin/openapp.js
const fs = require('fs');
const path = require('path');
const { ipcRenderer } = require('electron');
import { currentDirectory } from '../shell.js';

export async function run(args) {
  const targetApp = args[0];
  if (!targetApp) return "Usage: openapp [filename.html]";

  // Calculate physical path to the file
  const appPath = path.join(process.cwd(), currentDirectory, targetApp);

  if (!fs.existsSync(appPath)) {
    return `openapp: ${targetApp}: File not found.`;
  }

  // Tell main.js to cleanly switch the browser view onto the app
  ipcRenderer.send('change-view', path.relative(process.cwd(), appPath));
  return "Launching graphical window frame...";
}
