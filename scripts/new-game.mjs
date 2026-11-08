import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const [id, ...titleParts] = process.argv.slice(2);
if (!id || !/^[a-z][a-z0-9-]*$/.test(id)) {
  console.error('Usage: npm run game:new -- my-game "My Game" (lowercase letters, numbers, and hyphens for the ID)');
  process.exit(1);
}

const title = titleParts.join(' ').trim() || id.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join(' ');
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const template = await readFile(join(root, 'scripts', 'templates', 'starter.game.ts.txt'), 'utf8');
const source = template.replaceAll('__ID_LITERAL__', JSON.stringify(id)).replaceAll('__TITLE_LITERAL__', JSON.stringify(title));
const path = join(root, 'src', 'games', `${id}.game.ts`);

try {
  await writeFile(path, source, { flag: 'wx' });
} catch (error) {
  if (error?.code === 'EEXIST') {
    console.error(`Game file already exists: ${path}`);
    process.exit(1);
  }
  throw error;
}

await import('./sync-games.mjs');
console.log(`Created ${path}. Customize its rules and lessons, then run npm run test:games.`);
