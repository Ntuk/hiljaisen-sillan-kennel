import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAv3zv6rQa7x1d_rqo0xzTEynrwF_t-zVI",
  authDomain: "hiljaisen-sillan.firebaseapp.com",
  databaseURL: "https://hiljaisen-sillan-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "hiljaisen-sillan",
  storageBucket: "hiljaisen-sillan.appspot.com",
  messagingSenderId: "949869686853",
  appId: "1:949869686853:web:268fd83da9b898f9d8732c",
  measurementId: "G-8XH1MYT8H6"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
