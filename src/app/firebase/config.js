
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";


// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmdl1hZBjy3zW8HKlJS67my8S-RYT_cEA",
  authDomain: "to-do-list-937e1.firebaseapp.com",
  projectId: "to-do-list-937e1",
  storageBucket: "to-do-list-937e1.appspot.com", 
  messagingSenderId: "444444852945",
  appId: "1:444444852945:web:117804cd7a86660d3abbf0",
  measurementId: "G-X66GY9DDKR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Auth Setup
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);


export { auth, provider, signInWithPopup, db };
