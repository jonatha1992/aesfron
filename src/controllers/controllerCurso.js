import { db, doc, getDoc, getDocs, addDoc, collection, query, where } from "../firebase";

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
export async function getModulos(cursoid) {
    // Obtiene una referencia al documento del curso usando el ID proporcionado
    const cursoDocRef = doc(db, "cursos", cursoid);
    console.log(cursoid);

    try {
        // Obtiene el documento del curso desde Firestore
        const cursoSnapshot = await getDoc(cursoDocRef);
        console.log("Document data:", cursoSnapshot.data());
        // Verifica si el documento del curso existe
        if (!cursoSnapshot.exists()) {
            console.error("No se encontró el curso con el ID proporcionado.");
            return null; // Termina la función si el curso no existe
        }

        // Obtiene una referencia a la colección de módulos dentro del documento del curso
        const modulosCollectionRef = collection(cursoDocRef, "Modulos");

        // Obtiene todos los documentos de la colección de módulos
        const modulosSnapshot = await getDocs(modulosCollectionRef);

        // Crea una lista de promesas para obtener los datos de las unidades y sus ítems
        const unidadesPromises = modulosSnapshot.docs.map(async (moduloDoc) => {
            const unidadData = {
                id: moduloDoc.id,
                ...moduloDoc.data(), // Combina el ID del módulo y sus datos
            };

            // Obtiene una referencia a la subcolección de ítems dentro de cada módulo
            const itemsCollectionRef = collection(moduloDoc.ref, "items");

            // Obtiene todos los documentos de la subcolección de ítems
            const itemsSnapshot = await getDocs(itemsCollectionRef);

            // Agrega los ítems a los datos de la unidad
            unidadData.items = itemsSnapshot.docs.map((itemDoc) => ({
                id: itemDoc.id,
                ...itemDoc.data(), // Combina el ID del ítem y sus datos
            }));

            return unidadData; // Devuelve los datos de la unidad con sus ítems
        });

        console.log(unidadesPromises);
        // Espera a que todas las promesas se resuelvan
        const unidades = await Promise.all(unidadesPromises);

        console.log(unidades);
        // Ordena las unidades por su título
        // unidades.sort((a, b) => a.titulo.localeCompare(b.titulo));
        return unidades.sort((a, b) => a.titulo - b.titulo);
        console.log(unidades);
        return unidades; // Devuelve las unidades ordenadas
    } catch (error) {
        console.error("Error al obtener la información del curso:", error);
        throw error; // Lanza el error para que pueda ser manejado por el llamador de esta función
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
