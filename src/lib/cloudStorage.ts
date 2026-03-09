import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestoreDb, getCloudUser, isFirebaseConfigured } from './firebase';

const CLOUD_DOC_PATH = ['stockTracker', 'sharedState'] as const;
const CLOUD_META_KEY = 'st_cloud_migrated';
let cloudAccessDenied = false;

export interface CloudPayload {
  positions?: unknown[];
  accounts?: unknown[];
  watchlist?: unknown[];
  snapshots?: unknown[];
  currency?: string;
  trackers?: Record<string, { alerts: unknown[]; holdings: unknown[]; reports: unknown[] }>;
}

function canUseCloud(): boolean {
  return isFirebaseConfigured() && !!firestoreDb;
}

function getCloudRef() {
  if (!firestoreDb) return null;
  return doc(firestoreDb, ...CLOUD_DOC_PATH);
}

export async function loadCloudPayload(): Promise<CloudPayload | null> {
  if (!canUseCloud()) return null;
  if (!getCloudUser()) return null;
  const ref = getCloudRef();
  if (!ref) return null;

  try {
    const snapshot = await getDoc(ref);
    cloudAccessDenied = false;
    if (!snapshot.exists()) return null;
    return snapshot.data() as CloudPayload;
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;
    cloudAccessDenied = code === 'permission-denied';
    return null;
  }
}

export async function saveCloudPayload(payload: CloudPayload): Promise<boolean> {
  if (!canUseCloud()) return false;
  if (!getCloudUser()) return false;
  const ref = getCloudRef();
  if (!ref) return false;

  try {
    await setDoc(ref, { ...payload, updatedAt: new Date().toISOString() }, { merge: true });
    cloudAccessDenied = false;
    localStorage.setItem(CLOUD_META_KEY, 'true');
    return true;
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;
    cloudAccessDenied = code === 'permission-denied';
    return false;
  }
}

export function hasCompletedCloudMigration(): boolean {
  return localStorage.getItem(CLOUD_META_KEY) === 'true';
}

export function markCloudMigrationComplete(): void {
  localStorage.setItem(CLOUD_META_KEY, 'true');
}

export function isCloudAvailable(): boolean {
  return canUseCloud();
}

export function isCloudAccessDenied(): boolean {
  return cloudAccessDenied;
}

export function clearCloudAccessDenied(): void {
  cloudAccessDenied = false;
}
