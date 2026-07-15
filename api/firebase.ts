import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    // In Vercel, we will set FIREBASE_KEY environment variable with the JSON content of firebase-key.json
    const serviceAccount = JSON.parse(process.env.FIREBASE_KEY || '{}');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch (error) {
    console.error('Firebase initialization error', error);
  }
}

export const db = admin.firestore();
