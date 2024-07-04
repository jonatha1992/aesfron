import { db, doc, deleteDoc, updateDoc } from "../firebase";

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
