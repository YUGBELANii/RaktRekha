// firebase.ts

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBClTlPAP2IcXZstmtkddYtqsQGaB4qt8o",
  authDomain: "rakthrekha.firebaseapp.com",
  projectId: "rakthrekha",
  storageBucket: "rakthrekha.firebasestorage.app",
  messagingSenderId: "513290557185",
  appId: "1:513290557185:web:65e8ade22c95d23dca2d00",
  measurementId: "G-L76RMRMTVD"
};

// Initialize Firebase only once
const app = initializeApp(firebaseConfig);


// Export Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
