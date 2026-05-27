// Import Node's physical file system and path utilities
const fs = require('fs');
const path = require('path');

// Global application state variables
export let currentUser = "root";
export let currentDirectory = "usr/root"; // Defaults cleanly to /usr/root on boot

// Grab references to our HTML screen elements
const outputDisplay = document.getElementById('output');
const inputField = document.getElementById('input');
const promptDisplay = document.querySelector('.prompt');

/**
 * Updates the prompt display string dynamically based on the current state.
 * Example output: root@unixv7:/usr/root # 
 */
export function updatePrompt() {
  const symbol = currentUser === "root" ? "#" : "$";
  // Ensure the path always displays with a leading forward slash
  const displayPath = currentDirectory.startsWith('/') ? currentDirectory : `/${currentDirectory}`;
  promptDisplay.textContent = `${currentUser}@unixv7:${displayPath} ${symbol} `;
}

/**
 * Safely changes the active shell user and working directory state variables.
 * Accessible by commands like su.js and cd.js.
 */
export function setShellState(newUser, newDir) {
  if (newUser !== null && newUser !== undefined) currentUser = newUser;
  if (newDir !== null && newDir !== undefined) currentDirectory = newDir;
  updatePrompt();
}

// Global Enter Key Event Loop
inputField.addEventListener('keydown', async (event) => {
  if (event.key === 'Enter') {
    const rawInput = inputField.value.trim();
    inputField.value = ""; // Instantly clear the typing field
    
    // If the user just hits enter without typing anything
    if (rawInput === "") {
      outputDisplay.textContent += promptDisplay.textContent + "\n";
      return;
    }

    // Print the command line back to the terminal history log
    outputDisplay.textContent += promptDisplay.textContent + rawInput + "\n";

    // Split input into command name and arguments array
    const args = rawInput.split(/\s+/);
    const commandName = args.shift().toLowerCase();

    // Calculate the absolute path to the requested JS command file on the drive
    const commandFilePath = path.join(process.cwd(), 'bin', `${commandName}.js`);

    // Check if the command script physically exists in the bin/ folder
    if (fs.existsSync(commandFilePath)) {
      try {
        // Dynamically import the physical command module file script
        const commandModule = await import(`./bin/${commandName}.js`);
        
        // Execute the run function inside the command and wait for its string return
        const result = await commandModule.run(args);
        
        if (result !== undefined) {
          outputDisplay.textContent += result + "\n";
        }
      } catch (err) {
        outputDisplay.textContent += `${commandName}: execution failure -> ${err.message}\n`;
      }
    } else {
      // Fallback if the script does not exist physically in your bin folder
      outputDisplay.textContent += `${commandName}: command not found\n`;
    }

    // Force update the prompt layout and auto-scroll the screen downward
    updatePrompt();
    window.scrollTo(0, document.body.scrollHeight);
  }
});

/**
 * Boot Routine: Physically reads your etc/motd.txt file off your hard drive
 * on startup and displays it to the screen.
 */
async function bootSystem() {
  const motdPath = path.join(process.cwd(), 'etc', 'motd.txt');
  
  try {
    if (fs.existsSync(motdPath)) {
      const motdText = fs.readFileSync(motdPath, 'utf8');
      outputDisplay.textContent += motdText;
    } else {
      outputDisplay.textContent += "Welcome to Research Unix, 7th Edition.\n\n";
    }
  } catch (err) {
    outputDisplay.textContent += "System booted in standalone configuration.\n\n";
  }
  
  // Render the starting prompt line
  updatePrompt();
}

// Fire up the boot sequence when the script initializes
bootSystem();
