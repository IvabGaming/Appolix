// bin/cat.js
const fs = require('fs');
const path = require('path');
import { currentDirectory } from '../shell.js';

export async function run(args) {
  const targetFile = args[0];
  if (!targetFile) return "Usage: cat [filename]";

  // 1. Calculate the real absolute path on the computer
  // If path starts with "/", treat it as absolute from project root. Otherwise, treat as relative.
  const absolutePath = targetFile.startsWith('/')
    ? path.join(process.cwd(), targetFile)
    : path.join(process.cwd(), currentDirectory, targetFile);

  try {
    // 2. Safety Check: Verify the file exists physically
    if (!fs.existsSync(absolutePath)) {
      return `cat: ${targetFile}: No such file or directory`;
    }

    // 3. Safety Check: Ensure the user isn't trying to 'cat' a folder
    if (fs.statSync(absolutePath).isDirectory()) {
      return `cat: ${targetFile}: Is a directory`;
    }

    // 4. Physically read the text characters and return them
    const fileContents = fs.readFileSync(absolutePath, 'utf8');
    return fileContents;

  } catch (err) {
    return `cat: error reading file stream: ${err.message}`;
  }
}
