import { currentUser } from '../shell.js';

export async function run(args) {
  // Returns the active global username string ("root", "guest", etc.)
  return currentUser;
}
