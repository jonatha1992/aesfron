import { deleteDoc, db, doc, getDoc, getDocs, addDoc, collection, query, where, getCountFromServer } from "../firebase";
import { eliminarModulo } from "../controllers/controllerModulo";

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

export async function getAllCursosSeccion() {
    const cursosRef = collection(db, "cursos");
    const cursosSnapshot = await getDocs(cursosRef);
    let cursosConModulos = [];

    await Promise.all(
        cursosSnapshot.docs.map(async (doc) => {
            const cursoId = doc.id; // Guardamos el ID en una variable
            const modulosRef = collection(doc.ref, "Modulos");
            const modulosSnapshot = await getCountFromServer(modulosRef);
            const modulosCount = modulosSnapshot.data().count;

            if (modulosCount > 0) {
                cursosConModulos.push({
                    id: cursoId, // Usamos el ID guardado
                    ...doc.data(),
                    modulosCount: modulosCount,
                });
            }
        })
    );

    console.log(cursosConModulos);
    return cursosConModulos;
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
        const cursoRef = doc(db, "cursos", id);

        // Obtener todos los módulos del curso
        const modulosRef = collection(cursoRef, "Modulos");
        const modulosSnapshot = await getDocs(modulosRef);

        // Para cada módulo, llamar a eliminarModulo
        for (const moduloDoc of modulosSnapshot.docs) {
            await eliminarModulo(id, moduloDoc.id);
        }

        // Finalmente, eliminar el documento del curso
        await deleteDoc(cursoRef);

        console.log("Curso y todos sus contenidos eliminados exitosamente");
    } catch (error) {
        console.error("Error al borrar el curso:", error);
        throw error;
    }
}
