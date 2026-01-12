
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

// --- Firebase Configuration ---
// The app will attempt to use environment variables for Firebase config.
// If they are not set, Firebase features will be disabled.
// For a production build, these should be properly configured.
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

// Only initialize Firebase if the API key is present.
// This prevents the app from crashing if Firebase is not configured.
if (firebaseConfig.apiKey) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch (error) {
    console.error("Firebase initialization failed. Please check your configuration.", error);
    // Set auth to null if initialization fails
    auth = null;
  }
} else {
  console.warn("Firebase API key is missing. Firebase authentication features will be disabled. Please provide your Firebase project credentials in your environment setup.");
}

export { auth };
