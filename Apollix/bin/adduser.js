// bin/adduser.js
// This file runs inside your Electron environment with full Node.js access

const fs = require('fs');
const path = require('path');

export async function run(args) {
  const username = args[0];

  // 1. Syntax Check: Ensure the user typed a name
  if (!username) {
    return "Usage: adduser [username]";
  }

  // Validate username characters (alphanumeric only, no weird slashes)
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    return "adduser: invalid username characters";
  }

  // 2. Define the physical target paths on the computer
  // We use process.cwd() to anchor paths to your running project folder
  const passwdFilePath = path.join(process.cwd(), 'etc', 'passwd.txt');
  const newUserHomePath = path.join(process.cwd(), 'usr', username);

  try {
    // 3. Duplicate Prevention Check
    if (fs.existsSync(newUserHomePath)) {
      return `adduser: the user '${username}' or their home folder already exists.`;
    }

    // 4. Create the real physical home directory
    fs.mkdirSync(newUserHomePath, { recursive: true });

    // 5. Generate a dummy profile file inside their new space
    const welcomeFilePath = path.join(newUserHomePath, 'welcome.txt');
    fs.writeFileSync(welcomeFilePath, `Welcome to your new workspace, ${username}!\n`);

    // 6. Generate a random User ID (UID) number to match Unix style
    const mockUID = Math.floor(Math.random() * (900 - 100) + 100);

    // 7. Format the fresh entry line according to true 1979 V7 structures:
    // username : password(blank) : UID : GID(10) : RealName : HomeDir : ShellPath
    const passwdEntry = `${username}::${mockUID}:10:${username} User:/usr/${username}:/bin/sh\n`;

    // 8. Physically append the string to the end of etc/passwd.txt
    fs.appendFileSync(passwdFilePath, passwdEntry, 'utf8');

    return `User '${username}' created successfully.\nHome directory established at: /usr/${username}`;
  } catch (err) {
    return `adduser: system configuration write error: ${err.message}`;
  }
}
