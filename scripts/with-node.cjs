const { spawn, spawnSync } = require('node:child_process');
const { existsSync } = require('node:fs');
const { delimiter, dirname, join } = require('node:path');

const executable = process.platform === 'win32' ? 'node.exe' : 'node';
const candidates = [
  process.execPath,
  ...(process.env.PATH || '').split(delimiter).filter(Boolean).map((directory) => join(directory, executable)),
];
const seen = new Set();
const supported = [];

for (const candidate of candidates) {
  if (seen.has(candidate) || !existsSync(candidate)) continue;
  seen.add(candidate);
  const result = spawnSync(candidate, ['--version'], { encoding: 'utf8', timeout: 1000 });
  const match = /^v?(\d+)\.(\d+)\.(\d+)/.exec(result.stdout || '');
  if (!match) continue;
  const version = match.slice(1).map(Number);
  if (version[0] > 22 || (version[0] === 22 && version[1] >= 12)) {
    supported.push({ candidate, version });
  }
}

supported.sort((left, right) => {
  for (let part = 0; part < 3; part++) {
    if (left.version[part] !== right.version[part]) return right.version[part] - left.version[part];
  }
  return 0;
});

const selected = supported.find(({ candidate }) => candidate === process.execPath) || supported[0];
if (!selected) {
  console.error(`Node.js 22.12+ is required. Found ${process.version} at ${process.execPath}. Install a newer Node or add it to PATH.`);
  process.exit(1);
}

if (process.argv[2] === '--check') {
  console.log(`Using Node.js ${selected.version.join('.')} at ${selected.candidate}`);
  process.exit(0);
}

const [, , script, ...args] = process.argv;
if (!script) {
  console.error('Usage: node scripts/with-node.cjs <project script> [args...]');
  process.exit(1);
}

const projectRoot = join(__dirname, '..');
const child = spawn(selected.candidate, [join(projectRoot, script), ...args], {
  cwd: projectRoot,
  env: { ...process.env, PATH: `${dirname(selected.candidate)}${delimiter}${process.env.PATH || ''}` },
  stdio: 'inherit',
});
child.on('error', (error) => {
  console.error(`Could not start Node.js ${selected.version.join('.')}:`, error);
  process.exitCode = 1;
});
child.on('exit', (code, signal) => {
  process.exitCode = code ?? (signal ? 1 : 0);
});
