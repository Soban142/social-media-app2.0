import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL  } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";
import { getFirestore, addDoc, collection, setDoc, doc, getDoc, getDocs, query, where, updateDoc, deleteDoc, serverTimestamp, orderBy } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC_dmphOh_hdG6IhjuAxSMwSPfbc_zEVr0",
    authDomain: "social-media-app-26921.firebaseapp.com",
    projectId: "social-media-app-26921",
    storageBucket: "social-media-app-26921.appspot.com",
    messagingSenderId: "31645998599",
    appId: "1:31645998599:web:89f960e737b431caf394a2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
// const storageRef = ref(storage);
    
export {
    auth,
    app,
    db,
    storage,
    getFirestore,
    collection,
    addDoc,
    setDoc,
    doc,
    getDoc,
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    query,
    where,
    getDocs,
    onAuthStateChanged,
    signOut, 
    ref,
    uploadBytesResumable,
    getDownloadURL,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    orderBy
};
