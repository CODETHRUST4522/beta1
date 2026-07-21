import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "beta1-845fa.firebaseapp.com",
  projectId: "beta1-845fa",
  storageBucket: "beta1-845fa.firebasestorage.app",
  messagingSenderId: "972833644346",
  appId: "1:972833644346:web:5bae2f6c436e280e813a03",
};

const app = initializeApp(firebaseConfig);

export default app;