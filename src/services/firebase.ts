import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyArIjtHLBBVuzr2YDK07WmhRlvbKobuTKQ",
  authDomain: "group-store.firebaseapp.com",
  projectId: "group-store",
  storageBucket: "group-store.appspot.com",
  messagingSenderId: "416858056609",
  appId: "1:416858056609:web:05df6c9e6b46e88b1c8de0"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
