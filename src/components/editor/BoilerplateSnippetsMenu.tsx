import React, { useState } from 'react';
import { useWorkspaceStore, updateCode, appendLog } from '../../store/workspaceStore';
import { getGameById } from '../../data/gamesRegistry';
import { Language } from '../../types/lesson';
import { arcadeAudio } from '../../utils/audio';
import { Sparkles, Code2, Layers, ChevronDown, Check } from 'lucide-react';

export interface BoilerplateSnippet {
  id: string;
  label: string;
  description: string;
  snippets: Record<Language, string>;
}

export const GAME_BOILERPLATE_SNIPPETS: Record<string, BoilerplateSnippet[]> = {
  'neon-dungeon': [
    {
      id: 'player_vector',
      label: 'Cyber Hero Physics',
      description: 'Vector position and velocity update loop for player movement',
      snippets: {
        javascript: `// [Boilerplate: Cyber Hero Physics]
let player = { x: 200, y: 200, vx: 0, vy: 0, size: 20, speed: 3 };
if (keys['ArrowUp'] || keys['w']) player.vy = -player.speed;
else if (keys['ArrowDown'] || keys['s']) player.vy = player.speed;
else player.vy = 0;

if (keys['ArrowLeft'] || keys['a']) player.vx = -player.speed;
else if (keys['ArrowRight'] || keys['d']) player.vx = player.speed;
else player.vx = 0;

player.x += player.vx;
player.y += player.vy;`,
        python: `# [Boilerplate: Cyber Hero Physics]
player_x, player_y = 200, 200
player_vx, player_vy = 0, 0
speed = 3
if keys.get('UP') or keys.get('w'):
    player_vy = -speed
elif keys.get('DOWN') or keys.get('s'):
    player_vy = speed
else:
    player_vy = 0`,
        java: `// [Boilerplate: Cyber Hero Physics]
int playerX = 200, playerY = 200;
int vx = 0, vy = 0, speed = 3;
if (keys.containsKey("UP") || keys.containsKey("w")) {
    vy = -speed;
} else if (keys.containsKey("DOWN") || keys.containsKey("s")) {
    vy = speed;
} else {
    vy = 0;
}`,
      },
    },
    {
      id: 'aabb_collision',
      label: 'AABB Wall Collision',
      description: 'Bounding box boundary check for dungeon walls',
      snippets: {
        javascript: `// [Boilerplate: AABB Wall Collision]
function checkWallCollision(px, py, size, wall) {
  return px < wall.x + wall.w &&
         px + size > wall.x &&
         py < wall.y + wall.h &&
         py + size > wall.y;
}`,
        python: `# [Boilerplate: AABB Wall Collision]
def check_wall_collision(px, py, size, wall):
    return (px < wall['x'] + wall['w'] and
            px + size > wall['x'] and
            py < wall['y'] + wall['h'] and
            py + size > wall['y'])`,
        java: `// [Boilerplate: AABB Wall Collision]
public boolean checkWallCollision(int px, int py, int size, Rectangle wall) {
    return px < wall.x + wall.width &&
           px + size > wall.x &&
           py < wall.y + wall.height &&
           py + size > wall.y;
}`,
      },
    },
    {
      id: 'gem_spawner',
      label: 'Energy Gem Spawner',
      description: 'Random energy cell generator with score increment',
      snippets: {
        javascript: `// [Boilerplate: Energy Gem Spawner]
let gem = { x: Math.random() * 360 + 20, y: Math.random() * 360 + 20, size: 14 };
function respawnGem() {
  gem.x = Math.floor(Math.random() * 350) + 25;
  gem.y = Math.floor(Math.random() * 350) + 25;
  playScore();
}`,
        python: `# [Boilerplate: Energy Gem Spawner]
import random
gem = {'x': random.randint(30, 370), 'y': random.randint(30, 370), 'size': 14}
def respawn_gem():
    gem['x'] = random.randint(30, 370)
    gem['y'] = random.randint(30, 370)`,
        java: `// [Boilerplate: Energy Gem Spawner]
Point gem = new Point(150, 150);
public void respawnGem() {
    gem.x = (int)(Math.random() * 350) + 25;
    gem.y = (int)(Math.random() * 350) + 25;
}`,
      },
    },
  ],
  'cyber-invaders': [
    {
      id: 'strafe_physics',
      label: 'Cannon Strafe Physics',
      description: 'Horizontal screen-clamped strafe movement for defense cannon',
      snippets: {
        javascript: `// [Boilerplate: Cannon Strafe Physics]
let cannon = { x: 200, y: 360, width: 40, height: 16, speed: 5 };
if (keys['ArrowLeft'] || keys['a']) cannon.x = Math.max(20, cannon.x - cannon.speed);
if (keys['ArrowRight'] || keys['d']) cannon.x = Math.min(360, cannon.x + cannon.speed);`,
        python: `# [Boilerplate: Cannon Strafe Physics]
cannon_x = 200
speed = 5
if keys.get('LEFT') or keys.get('a'):
    cannon_x = max(20, cannon_x - speed)
elif keys.get('RIGHT') or keys.get('d'):
    cannon_x = min(360, cannon_x + speed)`,
        java: `// [Boilerplate: Cannon Strafe Physics]
int cannonX = 200, speed = 5;
if (keys.containsKey("LEFT") || keys.containsKey("a")) {
    cannonX = Math.max(20, cannonX - speed);
} else if (keys.containsKey("RIGHT") || keys.containsKey("d")) {
    cannonX = Math.min(360, cannonX + speed);
}`,
      },
    },
    {
      id: 'plasma_pool',
      label: 'Plasma Laser Pool',
      description: 'Projectile spawning array for space defense laser bolts',
      snippets: {
        javascript: `// [Boilerplate: Plasma Laser Pool]
let lasers = [];
function fireLaser(x, y) {
  lasers.push({ x: x, y: y, vy: -9, radius: 4 });
  playMove();
}`,
        python: `# [Boilerplate: Plasma Laser Pool]
lasers = []
def fire_laser(x, y):
    lasers.append({'x': x, 'y': y, 'vy': -9, 'radius': 4})`,
        java: `// [Boilerplate: Plasma Laser Pool]
List<Laser> lasers = new ArrayList<>();
public void fireLaser(int x, int y) {
    lasers.add(new Laser(x, y, -9));
}`,
      },
    },
    {
      id: 'armada_matrix',
      label: 'Alien Armada Matrix',
      description: 'Grid-based marching alien fleet matrix movement',
      snippets: {
        javascript: `// [Boilerplate: Alien Armada Matrix]
let armada = [];
for (let r = 0; r < 3; r++) {
  for (let c = 0; c < 6; c++) {
    armada.push({ x: 60 + c * 48, y: 50 + r * 36, active: true });
  }
}`,
        python: `# [Boilerplate: Alien Armada Matrix]
armada = [{'x': 60 + c * 48, 'y': 50 + r * 36, 'active': True} for r in range(3) for c in range(6)]`,
        java: `// [Boilerplate: Alien Armada Matrix]
List<Alien> armada = new ArrayList<>();
for (int r = 0; r < 3; r++) {
    for (int c = 0; c < 6; c++) {
        armada.add(new Alien(60 + c * 48, 50 + r * 36));
    }
}`,
      },
    },
  ],
};

interface BoilerplateSnippetsMenuProps {
  className?: string;
}

export const BoilerplateSnippetsMenu: React.FC<BoilerplateSnippetsMenuProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const activeGameId = useWorkspaceStore((state) => state.activeGameId);
  const activeLanguage = useWorkspaceStore((state) => state.activeLanguage);
  const currentCode = useWorkspaceStore((state) => state.codeMap[activeLanguage] || '');

  const snippets = GAME_BOILERPLATE_SNIPPETS[activeGameId] || GAME_BOILERPLATE_SNIPPETS['neon-dungeon'];

  const handleInsertSnippet = (snippetText: string, label: string) => {
    arcadeAudio.playClick();
    const updated = currentCode ? `${currentCode}\n\n${snippetText}` : snippetText;
    updateCode(activeLanguage, updated);
    appendLog(`[SYSTEM] Inserted boilerplate snippet '${label}' into ${activeLanguage.toUpperCase()} editor.`);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => {
          arcadeAudio.playClick();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-cyan-300 hover:text-cyan-200 text-xs font-mono font-bold rounded-lg transition-all shadow-sm cursor-pointer"
        title="Insert pre-configured game entity code snippets"
      >
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        <span>Snippets</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden p-1.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-1.5 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 flex items-center justify-between">
            <span>Entity Code Snippets</span>
            <span className="text-cyan-400">{activeLanguage.toUpperCase()}</span>
          </div>

          <div className="space-y-1 max-h-64 overflow-y-auto">
            {snippets.map((snip) => (
              <button
                key={snip.id}
                onClick={() => handleInsertSnippet(snip.snippets[activeLanguage], snip.label)}
                className="w-full text-left p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-cyan-500/40 transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {snip.label}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400">+ Insert</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">{snip.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
