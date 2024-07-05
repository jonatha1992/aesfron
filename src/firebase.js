import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    addDoc,
    deleteDoc,
    query,
    where,
    serverTimestamp,
    orderBy,
    limit,
    getCountFromServer,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

import { getStorage, uploadBytes, ref, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCcjRgJQwqJewSs85WRCkSyMRnSF6jMlHk",
    authDomain: "aesfron-69a52.firebaseapp.com",
    projectId: "aesfron-69a52",
    storageBucket: "aesfron-69a52.appspot.com",
    messagingSenderId: "429701236102",
    appId: "1:429701236102:web:e6062b3df1a3398003d807",
    measurementId: "G-H7ZGVD4P5V",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export const auth = getAuth(app);

export async function agregarDoc(dati, tabla) {
    dati.created = serverTimestamp();
    const newCourseRef = await addDoc(collection(db, tabla), dati);
    const cursoID = newCourseRef.id;
    return cursoID;
}

export async function obtenerRecientes(limite, tabla) {
    const q = query(collection(db, tabla), orderBy("created", "desc"), limit(limite));
    const querySnapshot = await getDocs(q);
    const eventos = [];
    querySnapshot.forEach((doc) => {
        eventos.push({ id: doc.id, ...doc.data() });
    });
    return eventos;
}

export async function actualizarDoc(id, datos, tabla) {
    const docRef = doc(db, tabla, id);
    await updateDoc(docRef, datos);
}

export {
    deleteDoc,
    collection,
    db,
    getDoc,
    doc,
    addDoc,
    setDoc,
    updateDoc,
    getDocs,
    query,
    where,
    storage,
    deleteObject,
    getDownloadURL,
    ref,
    uploadBytes,
    serverTimestamp,
    getCountFromServer,
};

// Función para agregar un documento
export async function agregarDocSub(data, path) {
    const colRef = collection(db, path);
    const docRef = await addDoc(colRef, data);
    return docRef;
}

// Función para agregar un documento en una subcolección
export async function agregarSubcoleccionDoc(data, path) {
    const colRef = collection(db, path);
    await addDoc(colRef, data);
}

export async function eliminarDoc(id, tabla) {
    await deleteDoc(doc(db, tabla, id));
}
// Función para subir archivos
export async function uploadFilesConte(file) {
    const storageRef = ref(storage, crypto.randomUUID());
    const metadata = {
        contentType: file.type,
    };
    const meta = await uploadBytes(storageRef, file, metadata);
    console.log(meta);
    const url = await getDownloadURL(storageRef);
    return url;
}

export const getDocumentCount = async (collectionPath) => {
    const colRef = collection(db, collectionPath);
    const snapshot = await getDocs(colRef);
    return snapshot.size;
};

export const uploadFile = async (file, cursoId, moduloId, itemId) => {
    const fileRef = ref(storage, `cursos/${cursoId}/Modulos/${moduloId}/items/${itemId}/${file.name}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    return url;
};
