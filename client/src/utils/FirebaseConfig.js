import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyD2i-vW6JTBnx8EzkIauU3QG081R_zEOAM",
  authDomain: "whatsapp-clone-55b30.firebaseapp.com",
  projectId: "whatsapp-clone-55b30",
  storageBucket: "whatsapp-clone-55b30.appspot.com",
  messagingSenderId: "180279867664",
  appId: "1:180279867664:web:4012ccc45a5ab1d0d58d95",
  measurementId: "G-KHVXD75VD7",
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
