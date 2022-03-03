import { initializeApp } from 'firebase/app';
import '@firebase/auth';
import '@firebase/firestore';
import { getFirestore, setDoc, doc, getDoc, getDocs, collection} from 'firebase/firestore';
import {getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword} from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyC6N35H5fRhufqCI3mhHds9rp0SYmrMpaE",
  authDomain: "connectr-2e821.firebaseapp.com",
  projectId: "connectr-2e821",
  storageBucket: "connectr-2e821.appspot.com",
  messagingSenderId: "749691667476",
  appId: "1:749691667476:web:6e2b81bb2f70756f55d301"
};

let app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth};