/* PJR Firebase Real Authentication — CDN ES Modules */

import { initializeApp }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAw4exMje14wkYRmMz46xiYIQpswXI27PU",
  authDomain: "pjr-fashion.firebaseapp.com",
  projectId: "pjr-fashion",
  storageBucket: "pjr-fashion.firebasestorage.app",
  messagingSenderId: "431601734777",
  appId: "1:431601734777:web:0608548db1175a005db0a8",
  measurementId: "G-6QYXCM7J3Z"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
};
