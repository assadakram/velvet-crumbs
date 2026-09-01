import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

function normalizePrivateKey(key: string): string {
  let clean = key.trim();
  // Strip trailing commas if copied accidentally from JSON
  if (clean.endsWith(',')) {
    clean = clean.slice(0, -1).trim();
  }
  // Strip outer quotes
  if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
    clean = clean.slice(1, -1);
  }
  // Replace literal '\n' sequences with real newlines
  clean = clean.replace(/\\n/g, '\n');
  // Normalize Windows/mixed linebreaks and extract clean non-empty lines
  const lines = clean.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  return lines.join('\n') + '\n';
}

function getFirebaseAdminApp(): App {
  if (getApps().length === 0) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !rawPrivateKey) {
      throw new Error(
        'Missing Firebase Admin credentials. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.'
      );
    }

    const privateKey = normalizePrivateKey(rawPrivateKey);

    return initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }
  return getApps()[0];
}

export function getDb(): Firestore {
  const app = getFirebaseAdminApp();
  return getFirestore(app);
}
