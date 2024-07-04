import { deleteFile, deleteDoc, db, doc, getDoc, getDocs, addDoc, collection, query, where } from "../firebase";

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
        return unidades.sort((a, b) => a.titulo - b.titulo);
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

export async function eliminarModulo(cursoId, moduloId) {
    try {
        console.log(`Intentando eliminar módulo con ID: ${moduloId} del curso: ${cursoId}`);
        const moduloDocRef = doc(db, "cursos", cursoId, "Modulos", moduloId);

        // Primero, eliminamos todos los ítems del módulo
        const itemsCollectionRef = collection(moduloDocRef, "items");
        const itemsSnapshot = await getDocs(itemsCollectionRef);
        const deleteItemPromises = itemsSnapshot.docs.map((itemDoc) => deleteDoc(doc(itemsCollectionRef, itemDoc.id)));
        await Promise.all(deleteItemPromises);

        // Luego, eliminamos el módulo
        await deleteDoc(moduloDocRef);
        console.log("Módulo y sus ítems eliminados exitosamente");
    } catch (error) {
        console.error("Error al eliminar el módulo:", error);
        throw error;
    }
}

export async function actualizarModulo(cursoId, moduloId, nuevosDatos) {
    try {
        console.log(`Intentando actualizar módulo con ID: ${moduloId} del curso: ${cursoId}`);
        const moduloDocRef = doc(db, "cursos", cursoId, "Modulos", moduloId);

        await updateDoc(moduloDocRef, nuevosDatos);
        console.log("Módulo actualizado exitosamente");
    } catch (error) {
        console.error("Error al actualizar el módulo:", error);
        throw error;
    }
}

export async function agregarModulo(cursoId, datosModulo) {
    try {
        console.log(`Intentando agregar nuevo módulo al curso: ${cursoId}`);
        const modulosCollectionRef = collection(db, "cursos", cursoId, "Modulos");

        // Añadir el nuevo módulo
        const nuevoModuloRef = await addDoc(modulosCollectionRef, datosModulo);

        console.log(`Nuevo módulo agregado con ID: ${nuevoModuloRef.id}`);

        // Obtener los datos del módulo recién creado
        const nuevoModuloSnapshot = await getDoc(nuevoModuloRef);

        // Devolver los datos del nuevo módulo incluyendo su ID
        return {
            id: nuevoModuloRef.id,
            ...nuevoModuloSnapshot.data(),
        };
    } catch (error) {
        console.error("Error al agregar el módulo:", error);
        throw error;
    }
}

export const updateItem = async (cursoId, moduloId, itemId, itemData) => {
    const itemRef = doc(db, `cursos/${cursoId}/Modulos/${moduloId}/items`, itemId);
    await updateDoc(itemRef, itemData);
};

export const deleteItem = async (itemId, cursoId, moduloId) => {
    const itemRef = doc(db, "cursos", cursoId, "Modulos", moduloId, "items", itemId);
    await deleteDoc(itemRef);
};
export const agregarItem = async (cursoId, moduloId, itemData) => {
    try {
        const itemsCollectionRef = collection(db, "cursos", cursoId, "Modulos", moduloId, "items");
        // Preparar los datos del ítem
        const newItemData = {
            ...itemData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        // Si es un PDF, asumimos que itemData.file contiene el archivo
        if (itemData.tipo === "pdf" && itemData.file) {
            // Aquí deberías subir el archivo a Firebase Storage y obtener la URL
            // Este es un ejemplo simplificado, deberás implementar la lógica de subida de archivos
            const fileUrl = await uploadPDFToFirebaseStorage(itemData.file);
            newItemData.url = fileUrl;
            delete newItemData.file; // No guardamos el archivo en Firestore, solo la URL
        }

        // Agregar el documento a la colección de ítems
        const docRef = await addDoc(itemsCollectionRef, newItemData);

        return docRef.id; // Devolver el ID del nuevo ítem
    } catch (error) {
        console.error("Error al agregar el ítem:", error);
        throw error;
    }
};
