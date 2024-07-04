import { storage, ref, uploadBytes, getDownloadURL, deleteObject } from "../firebase.js";

export async function uploadFiles(file) {
    const storageRef = ref(storage, crypto.randomUUID());
    const metadata = {
        contentType: "image/jpeg",
    };
    const meta = await uploadBytes(storageRef, file, metadata);
    console.log(meta);
    const url = await getDownloadURL(storageRef);
    return url;
}

export async function deleteFile(url) {
    console.log("la url desde bd: ", url);
    // var fileRef = storage.refFromURL(url);
    var fileRef = ref(storage, url);

    try {
        await deleteObject(fileRef);
        console.log("Archivo eliminado exitosamente.");
    } catch (error) {
        console.log("Error al eliminar archivo:", error);
    }
}
