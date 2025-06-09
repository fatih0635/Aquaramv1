// src/firebase.js

// 🔗 Firebase'i başlatmak için gerekli modüller
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyC7614RFwp5jDUVHZ5-iifpRrfGQVGlm98",
  authDomain: "aqua-ram-chat.firebaseapp.com",
  databaseURL: "https://aqua-ram-chat-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "aqua-ram-chat",
  storageBucket: "aqua-ram-chat.appspot.com",
  messagingSenderId: "82952521456",
  appId: "1:82952521456:web:8341ba1043890209c23635",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
