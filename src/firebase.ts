import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_REACT_APP_FB_API_KEY,
  authDomain: "chat-app-eea06.firebaseapp.com",
  projectId: "chat-app-eea06",
  storageBucket: "chat-app-eea06.appspot.com",
  messagingSenderId: "698204854933",
  appId: "1:698204854933:web:55b59994e3d34b17d6d99c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);