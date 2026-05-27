// shell.js
const fs = require('fs');
const path = require('path');

export let currentUser = "root";
export let currentDirectory = "usr/root";

let commandHistory = [];
let historyIndex = -1;

const outputDisplay = document.getElementById('output');
const inputField = document.getElementById('input');
const promptDisplay = document.querySelector('.prompt');

export function updatePrompt() {
  const symbol = currentUser === "root" ? "#" : "$";
  const displayPath = currentDirectory.startsWith('/') ? currentDirectory : `/${currentDirectory}`;
  if (promptDisplay) {
    promptDisplay.textContent = `${currentUser}@unixv7:${displayPath} ${symbol} `;
  }
}

export function setShellState(newUser, newDir) {
  if (newUser !== null && newUser !== undefined) currentUser = newUser;
  if (newDir !== null && newDir !== undefined) currentDirectory = newDir;
  updatePrompt();
}

/**
 * THE APOLLIX EXECUTOR API
 * This function can be called from ANY HTML file running in the app to execute a /bin command.
 * Example: window.apollix.execute("touch dynamic_file.txt");
 */
export async function executeCommand(rawInput) {
  const cleanInput = rawInput.trim();
  if (cleanInput === "") return "";

  const args = cleanInput.split(/\s+/);
  const commandName = args.shift().toLowerCase();
  const commandFilePath = path.join(process.cwd(), 'bin', `${commandName}.js`);

  if (fs.existsSync(commandFilePath)) {
    try {
      const commandModule = await import(`./bin/${commandName}.js`);
      const result = await commandModule.run(args);
      return result !== undefined ? result : "";
    } catch (err) {
      return `${commandName}: execution failure -> ${err.message}`;
    }
  } else {
    return `${commandName}: command not found`;
  }
}

// Attach the API to the global window object so HTML iframes/pages can see it
window.apollix = {
  execute: executeCommand,
  getState: () => ({ user: currentUser, dir: currentDirectory }),
  setState: setShellState
};

// Standard terminal keyboard input hook
if (inputField) {
  inputField.addEventListener('keydown', async (event) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (commandHistory.length === 0) return;
      if (historyIndex === -1) historyIndex = commandHistory.length - 1;
      else if (historyIndex > 0) historyIndex--;
      inputField.value = commandHistory[historyIndex];
    }
    else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (historyIndex === -1) return;
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        inputField.value = commandHistory[historyIndex];
      } else {
        historyIndex = -1;
        inputField.value = "";
      }
    }
    else if (event.key === 'Enter') {
      const rawInput = inputField.value.trim();
      inputField.value = "";
      
      if (rawInput === "") {
        outputDisplay.textContent += promptDisplay.textContent + "\n";
        return;
      }

      commandHistory.push(rawInput);
      historyIndex = -1;
      outputDisplay.textContent += promptDisplay.textContent + rawInput + "\n";

      const output = await executeCommand(rawInput);
      if (output) {
        outputDisplay.textContent += output + "\n";
      }

      updatePrompt();
      window.scrollTo(0, document.body.scrollHeight);
    }
  });
}

async function bootSystem() {
  const motdPath = path.join(process.cwd(), 'etc', 'motd.txt');
  if (outputDisplay) {
    try {
      if (fs.existsSync(motdPath)) {
        outputDisplay.textContent += fs.readFileSync(motdPath, 'utf8');
      } else {
        outputDisplay.textContent += "Welcome to Research Unix, 7th Edition.\n\n";
      }
    } catch (err) {
      outputDisplay.textContent += "System booted in standalone mode.\n\n";
    }
  }
  updatePrompt();
}

bootSystem();
