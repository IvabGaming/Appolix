// bin/ls.js
const fs = require('fs');
const path = require('path');
import { currentDirectory } from '../shell.js';

export async function run(args) {
  try {
    // Look directly at the physical path folder on the computer
    const absolutePath = path.join(process.cwd(), currentDirectory);
    
    if (!fs.existsSync(absolutePath)) return "";

    // Read the actual contents of the folder live from the drive
    const files = fs.readdirSync(absolutePath);

    // Append structural slashes to directories so they look like Unix
    const formatted = files.map(file => {
      const fullPath = path.join(absolutePath, file);
      if (fs.statSync(fullPath).isDirectory()) {
        return `${file}/`;
      }
      return file;
    });

    return formatted.sort().join('    ');
  } catch {
    return "ls: reading directory stream failed";
  }
}
