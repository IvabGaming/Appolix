// bin/cd.js
const fs = require('fs');
const path = require('path');
import { currentDirectory, setShellState } from '../shell.js';

export async function run(args) {
  const targetPath = args[0];
  
  // Typing just 'cd' with no arguments returns the user to the root '/' folder
  if (!targetPath || targetPath === "/") {
    setShellState(null, "");
    return undefined;
  }

  // 1. Calculate the tentative target directory path
  let calculatedPath = "";
  if (targetPath.startsWith('/')) {
    calculatedPath = targetPath; // Absolute path from project root
  } else {
    calculatedPath = path.join(currentDirectory, targetPath); // Relative path
  }

  // 2. Resolve the path to get rid of relative jumps like ".." or "."
  // This turns a messy string like "usr/root/../guest" into a clean "usr/guest"
  const absoluteTarget = path.resolve(process.cwd(), calculatedPath);
  const relativeFromRoot = path.relative(process.cwd(), absoluteTarget);

  // 3. Security Boundary: Block users from backing out past your project's main folder
  if (relativeFromRoot.startsWith('..')) {
    return "cd: permission denied (cannot traverse outside system root)";
  }

  try {
    // 4. Physical Verification: Make sure the target location actually exists
    if (!fs.existsSync(absoluteTarget)) {
      return `cd: no such file or directory: ${targetPath}`;
    }

    // 5. Verification: Ensure the target is an actual folder, not a regular file
    if (!fs.statSync(absoluteTarget).isDirectory()) {
      return `cd: not a directory: ${targetPath}`;
    }

    // 6. Update the prompt to reflect the successful path shift
    setShellState(null, relativeFromRoot);
    return undefined;

  } catch (err) {
    return `cd: navigation error: ${err.message}`;
  }
}
