import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBkLn2Pb9GtblVeMmM47748M1pJH-pjzBY",
    authDomain: "online-users-dashboard.firebaseapp.com",
    databaseURL: "https://online-users-dashboard-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "online-users-dashboard",
    storageBucket: "online-users-dashboard.appspot.com",
    messagingSenderId: "531481529805",
    appId: "1:531481529805:web:cb66326bb38bcbc70b0884",
    measurementId: "G-H2SD3WRVWT"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);