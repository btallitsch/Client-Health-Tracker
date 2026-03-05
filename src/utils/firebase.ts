import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDVcScBRrjRVJ9MrXphZ8YwUL1x8HdKI9g",
  authDomain: "client-health-tracker-12e55.firebaseapp.com",
  projectId: "client-health-tracker-12e55",
  storageBucket: "client-health-tracker-12e55.firebasestorage.app",
  messagingSenderId: "753876758237",
  appId: "1:753876758237:web:9f78b3efd4004c78e73534",
  measurementId: "G-BGX0RHXEPX"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
