
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// IMPORTANT: Replace with your app's Firebase project configuration.
// This configuration is typically found in your project's settings on the Firebase console.
const firebaseConfig = {
  apiKey: "AIzaSyB...YOUR_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "1:your-sender-id:web:your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
