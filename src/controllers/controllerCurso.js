import { deleteDoc, db, doc, getDoc, getDocs, addDoc, collection, query, where } from "../firebase";

export async function agregarCurso(dati) {
    const newCourseRef = await addDoc(collection(db, "cursos"), dati);
    const cursoID = newCourseRef.id;
    return cursoID;
}

export async function getAllCursos() {
    // Use the getDocs function to retrieve all documents from the "cursos" collection
    const cursosSnapshot = await getDocs(collection(db, "cursos"));
    const cursos = cursosSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
    }));
    return cursos;
}

export async function getCurso(cursoId) {
    const userDocRef = doc(db, "cursos", cursoId);
    try {
        const userDoc = await getDoc(userDocRef);
        console.log("Document data:", userDoc.data());
        if (!userDoc.exists()) {
            throw new Error("El documento del curso no existe!");
        }
        return userDoc.data();
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const ContenidoXCurso = async (cursoid) => {
    const contenidoRef = collection(db, "cursos");
    const q1 = query(contenidoRef, where("cursoid", "==", cursoid));
    console.log("q1: ", q1);
    const querySnapshot = await getDocs(q1);

    // Construye un array con los resultados
    const resultados = [];

    querySnapshot.forEach((doc) => {
        resultados.push({ id: doc.id, ...doc.data() });
    });

    return resultados;
};

export async function deleteCurso(id) {
    try {
        console.log("Intentando eliminar curso con ID:", id);
        const docRef = doc(db, "cursos", id);
        console.log("Referencia del documento:", docRef);
        await deleteDoc(docRef);
        console.log("Documento eliminado exitosamente");
    } catch (error) {
        console.error("Error al borrar el curso:", error);
        throw error;
    }
}
