// bin/rm.js
// This command executes natively inside your Electron runtime

const fs = require('fs');
const path = require('path');
import { currentDirectory } from '../shell.js';

export async function run(args) {
  const targetFile = args[0]; // Grab the first argument typed after 'rm'

  // 1. Syntax Check: Ensure the user specified a file to delete
  if (!targetFile) {
    return "Usage: rm [filename]";
  }

  // 2. Calculate the target path on the hard drive
  const absolutePath = targetFile.startsWith('/')
    ? path.join(process.cwd(), targetFile)
    : path.join(process.cwd(), currentDirectory, targetFile);

  try {
    // 3. Safety Check: Verify the file actually exists physically
    if (!fs.existsSync(absolutePath)) {
      return `rm: ${targetFile}: No such file or directory`;
    }

    // 4. Safety Check: True Unix rm cannot delete directories without a -r flag
    if (fs.statSync(absolutePath).isDirectory()) {
      return `rm: ${targetFile}: is a directory (use rmdir or add flags later)`;
    }

    // 5. System Protection Guard: Stop users from deleting core system files
    if (absolutePath === path.join(process.cwd(), 'shell.js') || 
        absolutePath === path.join(process.cwd(), 'index.html')) {
      return "rm: permission denied (cannot delete core simulator assets)";
    }

    // 6. Physically delete the file from the hard drive
    fs.unlinkSync(absolutePath);
    
    return undefined; // Returns absolutely nothing on success, matching true Unix behavior!

  } catch (err) {
    return `rm: cannot remove file: ${err.message}`;
  }
}
