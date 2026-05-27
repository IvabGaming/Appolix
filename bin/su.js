const fs = require('fs');
const path = require('path');
import { setShellState } from '../shell.js';

export async function run(args) {
  const targetUser = args[0];
  if (!targetUser) return "Usage: su [username]";

  const passwdPath = path.join(process.cwd(), 'etc', 'passwd.txt');

  try {
    // 1. Physically read your true etc/passwd.txt file off the hard drive
    const data = fs.readFileSync(passwdPath, 'utf8');
    const lines = data.split('\n');

    let userExists = false;
    let targetHomeDir = `usr/${targetUser}`;

    // 2. Parse the colon-separated text strings line by line
    for (const line of lines) {
      if (line.trim() === "") continue;
      const fields = line.split(':');
      const registeredName = fields[0];

      if (registeredName === targetUser) {
        userExists = true;
        // Extract home directory info from the passwd text structure
        // e.g., mapping /usr/ivan to your local usr/ivan folder path
        const rawHome = fields[5]; 
        targetHomeDir = rawHome.startsWith('/') ? rawHome.substring(1) : rawHome;
        break;
      }
    }

    // 3. If found, update the prompt and working location automatically
    if (userExists) {
      setShellState(targetUser, targetHomeDir);
      return `Session changed to ${targetUser}.`;
    } else {
      return `su: unknown login: ${targetUser}`;
    }

  } catch (err) {
    return `su: system identity verification failure: ${err.message}`;
  }
}
