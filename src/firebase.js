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

// import { agregarItemsModulo } from "./security/Tools";
// import { fabClasses } from "@mui/material";
// const itemsToBeAdded = [
//     {
//         tipo: "video",
//         titulo: "Cuidados para el neurodesarrollo. ",
//         url: "http://link-al-video.com",
//     },
//     {
//         tipo: "pdf",
//         titulo: "La importancia de la leche humana en UCIN",
//         url: "http://link-al-pdf.com",
//     },
//     {
//         tipo: "video",
//         titulo: "Drogas de reanimación",
//         url: "http://link-al-video.com",
//     },
//     {
//         tipo: "video",
//         titulo: "Cuidado Canguro ",
//         url: "http://link-al-video.com",
//     },
//     {
//         tipo: "pdf",
//         titulo: "Niveles de ruido en UCIN- Prevención de la hipoacusia",
//         url: "http://link-al-pdf.com",
//     },
//     {
//         tipo: "video",
//         titulo: "Paciente Recién Nacido quirúrgico",
//         url: "http://link-al-video.com",
//     },
//     {
//         tipo: "video",
//         titulo: "Cuidado infectologico en UCIN",
//         url: "http://link-al-video.com",
//     },
//     {
//         tipo: "pdf",
//         titulo: "Trastornos de la deglución en el Recién Nacido de Riesgo",
//         url: "http://link-al-pdf.com",
//     },
//     {
//         tipo: "video",
//         titulo: "Detección del síndrome genético en el Recién Nacido/ Cardiopatías neonatales",
//         url: "http://link-al-video.com",
//     },
// ];

// const path = "cursos/6ThlcAF2z98yAXyJ4xT1/Modulos/yI2XjQ4swxT5NxTcDc3B/items";
// agregarItemsModulo(path, itemsToBeAdded);

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
};

// const ContenidoXCurso = async (cursoid) => {
//     const contenidoRef = collection(db, "contenido");
//     const q1 = query(contenidoRef, where("cursoid", "==", cursoid));

//     const querySnapshot = await getDocs(q1);

//     // Construye un array con los resultados
//     const resultados = [];

//     querySnapshot.forEach((doc) => {
//         resultados.push({ id: doc.id, ...doc.data() });
//     });

//     return resultados;
// };

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
