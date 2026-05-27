// bin/touch.js
// This file executes natively inside your Electron runtime

const fs = require('fs');
const path = require('path');
import { currentDirectory } from '../shell.js';

export async function run(args) {
  const targetFile = args[0];

  // 1. Syntax Check: Ensure the user typed a filename
  if (!targetFile) {
    return "Usage: touch [filename]";
  }

  // 2. Calculate the target path on the hard drive
  const absolutePath = targetFile.startsWith('/')
    ? path.join(process.cwd(), targetFile)
    : path.join(process.cwd(), currentDirectory, targetFile);

  try {
    // 3. True Unix Touch Behavior: 
    // If the file exists, update its modified time. If it doesn't, write an empty file string.
    if (fs.existsSync(absolutePath)) {
      const now = new Date();
      fs.utimesSync(absolutePath, now, now);
      return undefined; // Returns nothing on success, matching Unix behavior
    } else {
      fs.writeFileSync(absolutePath, '', 'utf8');
      return undefined;
    }
  } catch (err) {
    return `touch: cannot create file: ${err.message}`;
  }
}
