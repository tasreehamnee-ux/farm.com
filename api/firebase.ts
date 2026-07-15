import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const keyString = process.env.FIREBASE_KEY || '{}';
    const serviceAccount = JSON.parse(keyString);
    
    // Fix newline escaping issues from Vercel environment variables
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch (error) {
    console.error('Firebase initialization error', error);
  }
}

export const db = admin.firestore();
