import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyArIjtHLBBVuzr2YDK07WmhRlvbKobuTKQ",
  authDomain: "group-store-441ab.firebaseapp.com", // 👈 أضف اللاحقة هنا
  projectId: "group-store-441ab",                // 👈 أضف اللاحقة هنا
  storageBucket: "group-store-441ab.appspot.com", // 👈 أضف اللاحقة هنا
  messagingSenderId: "416858056609",
  appId: "1:416858056609:web:05df6c9e6b46e88b1c8de0"
};

const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
