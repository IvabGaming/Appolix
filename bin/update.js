// bin/update.js
const fs = require('fs');
const path = require('path');
const https = require('https');

function downloadAsset(url, localDest) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) return reject(new Error(`HTTP ${response.statusCode}`));
      const fileStream = fs.createWriteStream(localDest);
      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
    }).on('error', (err) => reject(err));
  });
}

export async function run(args) {
  // Replace these variables with your exact GitHub repository routing information
  const user = "IvabGaming";
  const repo = "Apollix";
  const baseUrl = `https://github.com/${user}/${repo}`;

  // Explicit index of files your updater will cleanly stream down from your repository
  const systemFiles = [
    "index.html", "shell.js", "package.json", "main.js", "preload.js",
    "etc/motd.txt", "etc/passwd.txt", "usr/root/secret.txt", "usr/guest/readme.txt",
    "bin/cat.js", "bin/cd.js", "bin/ls.js", "bin/clear.js", "bin/date.js", 
    "bin/su.js", "bin/whoami.js", "bin/adduser.js", "bin/touch.js", "bin/rm.js", 
    "bin/openapp.js", "bin/update.js"
  ];

  // Inform the output interface log container directly
  const log = document.getElementById('output');
  if (log) log.textContent += "\n[Apollix Updater] Commencing live file tree audit...\n";

  try {
    for (const relativePath of systemFiles) {
      const remoteUrl = `${baseUrl}/${relativePath}`;
      const localPath = path.join(process.cwd(), relativePath.replace(/\//g, path.sep));
      
      // Ensure local target directory structures exist before firing data stream writes
      fs.mkdirSync(path.dirname(localPath), { recursive: true });
      await downloadAsset(remoteUrl, localPath);
    }
    return "\n[Update Status]: Patches applied successfully! Please close and restart the application window.";
  } catch (err) {
    return `\n[Update Failed]: Code network connection drop -> ${err.message}`;
  }
}
