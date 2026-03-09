import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean);

export const firebaseApp = hasFirebaseConfig
  ? (getApps().length ? getApp() : initializeApp(firebaseConfig))
  : null;

export const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : null;
export const firestoreDb = firebaseApp ? getFirestore(firebaseApp) : null;
const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle(): Promise<boolean> {
  if (!firebaseAuth) return false;
  try {
    await signInWithPopup(firebaseAuth, googleProvider);
    return !!firebaseAuth.currentUser;
  } catch {
    return false;
  }
}

export async function signOutCloudUser(): Promise<void> {
  if (!firebaseAuth) return;
  try {
    await signOut(firebaseAuth);
  } catch {
    // no-op
  }
}

export function getCloudUser(): User | null {
  return firebaseAuth?.currentUser ?? null;
}

export function onCloudAuthChanged(callback: (user: User | null) => void): () => void {
  if (!firebaseAuth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(firebaseAuth, callback);
}

export function isFirebaseConfigured(): boolean {
  return !!firebaseApp && !!firestoreDb && !!firebaseAuth;
}
