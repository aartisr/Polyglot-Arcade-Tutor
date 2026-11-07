import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  serverTimestamp,
  getDocs
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { arcadeAudio } from '../utils/audio';

export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  category: 'speed' | 'accuracy' | 'polyglot' | 'mastery';
  icon: string;
  points: number;
}

export interface UnlockedAchievementRecord {
  badgeId: string;
  title: string;
  description: string;
  category: string;
  unlockedAt?: any;
}

export const BADGE_CATALOG: BadgeDefinition[] = [
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Pass step validation checks in record time (< 15s).',
    category: 'speed',
    icon: '⚡',
    points: 150,
  },
  {
    id: 'flawless_compiler',
    title: 'Flawless Compiler',
    description: 'Complete a step with 100% test accuracy on first try.',
    category: 'accuracy',
    icon: '🎯',
    points: 200,
  },
  {
    id: 'aabb_architect',
    title: 'AABB Shield Master',
    description: 'Successfully implement Axis-Aligned Bounding Box collision math.',
    category: 'mastery',
    icon: '🛡️',
    points: 250,
  },
  {
    id: 'polyglot_pioneer',
    title: 'PolyGlot Pioneer',
    description: 'Run code in JavaScript, Python, and Java modes.',
    category: 'polyglot',
    icon: '🥇',
    points: 300,
  },
  {
    id: 'nightmare_runner',
    title: 'Nightmare Survivor',
    description: 'Execute the game loop on Level 5 Nightmare difficulty.',
    category: 'speed',
    icon: '💥',
    points: 350,
  },
  {
    id: 'master_rogue',
    title: 'Rogue Crawler Overlord',
    description: 'Complete all 4 game development curriculum steps!',
    category: 'mastery',
    icon: '👑',
    points: 500,
  },
];

const COLLECTION_NAME = 'user_achievements';

// Real-time listener for unlocked achievements
export function subscribeUnlockedAchievements(onUpdate: (unlockedMap: Record<string, UnlockedAchievementRecord>) => void) {
  try {
    const ref = collection(db, COLLECTION_NAME);
    return onSnapshot(
      ref,
      (snapshot) => {
        const map: Record<string, UnlockedAchievementRecord> = {};
        snapshot.docs.forEach((d) => {
          map[d.id] = d.data() as UnlockedAchievementRecord;
        });
        onUpdate(map);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
    return () => {};
  }
}

// Unlock an achievement in Firestore
export async function unlockAchievement(badgeId: string): Promise<boolean> {
  const badgeDef = BADGE_CATALOG.find((b) => b.id === badgeId);
  if (!badgeDef) return false;

  try {
    const docRef = doc(db, COLLECTION_NAME, badgeId);
    await setDoc(docRef, {
      badgeId,
      title: badgeDef.title,
      description: badgeDef.description,
      category: badgeDef.category,
      unlockedAt: serverTimestamp(),
    });
    arcadeAudio.playVictoryFanfare();
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${COLLECTION_NAME}/${badgeId}`);
    return false;
  }
}
