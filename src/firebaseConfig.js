// firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBHbHqIEhRz7iKTJHdlr2HOtpVK0JxMDc4",
    authDomain: "automationproject-e72bd.firebaseapp.com",
    projectId: "automationproject-e72bd",
    storageBucket: "automationproject-e72bd.appspot.com",
    messagingSenderId: "608615821395",
    appId: "1:608615821395:web:1ec4369556afa3dda556a6",
    measurementId: "G-SX61XNF6TK"
};

const app = initializeApp(firebaseConfig);
const txtDB = getFirestore(app);
const imgDB = getStorage(app);

export { imgDB, txtDB };






