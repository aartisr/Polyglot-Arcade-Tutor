import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  getDocs,
  where
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Language, DifficultyLevel } from '../types/lesson';

export interface HighScoreRecord {
  id?: string;
  playerName: string;
  score: number;
  language: Language;
  difficulty: DifficultyLevel;
  createdAt?: any;
}

const COLLECTION_NAME = 'high_scores';

// Subscribe to real-time top high scores
export function subscribeTopHighScores(
  onUpdate: (scores: HighScoreRecord[]) => void,
  filterLang?: Language | 'all'
) {
  try {
    const scoresRef = collection(db, COLLECTION_NAME);
    let q = query(scoresRef, orderBy('score', 'desc'), limit(25));

    if (filterLang && filterLang !== 'all') {
      q = query(scoresRef, where('language', '==', filterLang), orderBy('score', 'desc'), limit(25));
    }

    return onSnapshot(
      q,
      (snapshot) => {
        const scores: HighScoreRecord[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<HighScoreRecord, 'id'>),
        }));
        onUpdate(scores);
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

// Submit a new high score to Firestore
export async function submitHighScore(
  playerName: string,
  score: number,
  language: Language,
  difficulty: DifficultyLevel
): Promise<string> {
  const sanitizedName = playerName.trim().substring(0, 30) || 'Anonymous Rogue';
  
  try {
    const scoresRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(scoresRef, {
      playerName: sanitizedName,
      score: Math.max(0, score),
      language,
      difficulty,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, COLLECTION_NAME);
    throw error;
  }
}
