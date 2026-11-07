import { 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Language } from '../types/lesson';

export interface UserProfileData {
  handle: string;
  codingSeconds: number;
  languagesMastered: Language[];
  earnedBadges: string[];
  xp: number;
  updatedAt?: any;
}

const COLLECTION_NAME = 'user_profiles';
const DEFAULT_PROFILE_ID = 'local_hero_profile';

export function subscribeUserProfile(
  profileId: string = DEFAULT_PROFILE_ID,
  onUpdate: (profile: UserProfileData) => void
) {
  try {
    const docRef = doc(db, COLLECTION_NAME, profileId);
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          onUpdate(snapshot.data() as UserProfileData);
        } else {
          // Provide default initial state if document doesn't exist yet
          onUpdate({
            handle: 'NEON_HACKER_01',
            codingSeconds: 14400, // 4 hours starter
            languagesMastered: ['javascript'],
            earnedBadges: ['flawless_compiler', 'speed_demon'],
            xp: 450,
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `${COLLECTION_NAME}/${profileId}`);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${COLLECTION_NAME}/${profileId}`);
    return () => {};
  }
}

export async function saveUserProfile(
  profileData: Omit<UserProfileData, 'updatedAt'>,
  profileId: string = DEFAULT_PROFILE_ID
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, profileId);
    await setDoc(docRef, {
      ...profileData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTION_NAME}/${profileId}`);
    throw error;
  }
}
