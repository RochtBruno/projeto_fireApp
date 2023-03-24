import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB-LSlVcz36rzNITMQc7mPQPCAxEKd9gdo",
  authDomain: "projeto-teste-48344.firebaseapp.com",
  projectId: "projeto-teste-48344",
  storageBucket: "projeto-teste-48344.appspot.com",
  messagingSenderId: "730709292138",
  appId: "1:730709292138:web:42137fad0184847bb44613",
  measurementId: "G-VB28FMFP99",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const auth = getAuth(firebaseApp);

export { db, auth };
