import { db, doc, deleteDoc, updateDoc } from "../firebase";

export const updateItem = async (cursoId, moduloId, itemId, itemData) => {
    const itemRef = doc(db, `cursos/${cursoId}/Modulos/${moduloId}/items`, itemId);
    await updateDoc(itemRef, itemData);
};

export const deleteItem = async (cursoId, moduloId, itemId) => {
    try {
        console.log(`Intentando eliminar ítem con ID: ${itemId} del módulo: ${moduloId} en el curso: ${cursoId}`);
        const itemRef = doc(db, "cursos", cursoId, "Modulos", moduloId, "items", itemId);

        // Obtener los datos del ítem antes de eliminarlo
        const itemSnapshot = await getDoc(itemRef);
        if (!itemSnapshot.exists()) {
            throw new Error("El ítem no existe");
        }
        const itemData = itemSnapshot.data();

        // Si el ítem tiene una URL (para PDF o imagen), eliminarla del storage
        if (itemData.url) {
            await deleteFile(itemData.url);
            console.log(`Archivo asociado eliminado: ${itemData.url}`);
        }

        // Eliminar el documento del ítem
        await deleteDoc(itemRef);
        console.log(`Ítem ${itemId} eliminado exitosamente`);
    } catch (error) {
        console.error("Error al eliminar el ítem:", error);
        throw error;
    }
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
