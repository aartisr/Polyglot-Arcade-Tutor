const [major, minor] = process.versions.node.split('.').map(Number);

if (major !== 22 || minor < 12) {
  console.error(`Node.js 22.12+ is required (found ${process.version}). Run "nvm install && nvm use" in the project directory.`);
  process.exit(1);
}
