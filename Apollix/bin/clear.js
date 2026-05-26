export async function run(args) {
  // Directly targets the screen log container and wipes it blank
  document.getElementById('output').textContent = "";
  return undefined; // Returns nothing so no extra newlines are printed
}
