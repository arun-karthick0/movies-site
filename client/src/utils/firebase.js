import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBrwho8hR5gsRoJByFvkLFtjqggaIepHug",
  authDomain: "netflix-9bfc2.firebaseapp.com",
  projectId: "netflix-9bfc2",
  storageBucket: "netflix-9bfc2.appspot.com",
  messagingSenderId: "876214821961",
  appId: "1:876214821961:web:1db5bd29fab4ddd551cb98",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };
