// Your web app's Firebase configuration
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

export const firebaseConfig = {
  apiKey: "AIzaSyB2NLHYSSIfF3e3e4Nw63n120qVVCGk_uI",
  authDomain: "blur-login-143df.firebaseapp.com",
  projectId: "blur-login-143df",
  storageBucket: "blur-login-143df.appspot.com",
  messagingSenderId: "843300389359",
  appId: "1:843300389359:web:ef0ff681eed401cd48b61a",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);