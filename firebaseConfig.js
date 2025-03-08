import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDoix9a6kA4dYiKSYdV4BCz90LLcfWlP00",
    authDomain: "studyapp-c3ffb.firebaseapp.com",
    projectId: "studyapp-c3ffb",
    storageBucket: "studyapp-c3ffb.firebasestorage.app",
    messagingSenderId: "15378532215",
    appId: "1:15378532215:web:59bb76177fe94170160372",
    measurementId: "G-HQYF2ET8DB"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };