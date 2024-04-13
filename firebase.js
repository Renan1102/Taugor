import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAQszP52PYlgUSTr7gGHzEnnLuyRuBYo7M",
    authDomain: "teste-c3f4b.firebaseapp.com",
    projectId: "teste-c3f4b",
    storageBucket: "teste-c3f4b.appspot.com",
    messagingSenderId: "11385714998",
    appId: "1:11385714998:web:caf52b3d8adec20c2f9b97",
    measurementId: "G-D7KHQSV12J"
  };


  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app)
  const storage = getStorage(app);
  const auth = getAuth(app)

  export {db, app, auth, storage};