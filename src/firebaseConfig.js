// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
//import createUserWithEmailAndPassword from "firebase/auth"

import { getFirestore, collection, addDoc } from "firebase/firestore";



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBnrlKSmV2z88VKBTN1G9Pw0O0MFlMPu4M",
  authDomain: "pomodoro-timer-7575d.firebaseapp.com",
  projectId: "pomodoro-timer-7575d",
  storageBucket: "pomodoro-timer-7575d.firebasestorage.app",
  messagingSenderId: "768275917145",
  appId: "1:768275917145:web:f4442857635bbe200cc448"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { app, auth, db };