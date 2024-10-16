import { getApp, getApps, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
import { FirebaseStorage, getStorage } from "firebase/storage";
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// initializes the Firebase Client SDK with environment variables
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);
const auth = getAuth(app);

// explicitly set persistence to local to makes sure it is there
setPersistence(auth, browserLocalPersistence);

export { db, storage, auth };
