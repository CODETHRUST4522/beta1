import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCb-stvbSaVGqTEy68sDHgR1lmfQpIlCmI",
  authDomain: "beta1-845fa.firebaseapp.com",
  projectId: "beta1-845fa",
  storageBucket: "beta1-845fa.firebasestorage.app",
  messagingSenderId: "972833644346",
  appId: "1:972833644346:web:5bae2f6c436e280e813a03",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;