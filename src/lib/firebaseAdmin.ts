import admin from "firebase-admin";
import { getApps } from "firebase-admin/app";

const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID!,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
  privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET!,
};

if (!getApps().length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseAdminConfig),
    storageBucket: firebaseAdminConfig.storageBucket,
  });
}

export const adminDb: admin.firestore.Firestore = admin.firestore();
export const adminStorage: admin.storage.Storage = admin.storage();
