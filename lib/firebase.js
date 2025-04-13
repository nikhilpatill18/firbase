import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAfll_ew3SFF6sY9ss2TJVQnPUwWARFg0k",
    authDomain: "trial-93eb3.firebaseapp.com",
    projectId: "trial-93eb3",
    storageBucket: "trial-93eb3.firebasestorage.app",
    messagingSenderId: "147304682670",
    appId: "1:147304682670:web:104cf1aabbed65cdd4093f",
    measurementId: "G-JSYTS0PNR4"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };
