import {
  deleteDoc,
  collection,
  db,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  where,
  storage,
  getCountFromServer,
} from "../firebase";

import {
  getCountry,
  getState,
  convertFirebaseTimestampToDate,
} from "../security/Tools";
export async function agregarUser(user) {
  try {
    const userData = {
      uid: user.uid,
      rol: "user",
      nombre_completo: user.nombre_completo,
      DNI: user.DNI,
      fecha_nacimiento: user.fecha_nacimiento,
      pais: user.pais,
      provincia: user.provincia,
      localidad: user.localidad,
      codigo_postal: user.codigo_postal,
      calle: user.calle,
      numero: user.numero,
      dept: user.dept,
      piso: user.piso,
      telefono: user.telefono,
      email: user.email,
      nivel: user.nivel,
      institucion: user.institucion,
      puesto: user.puesto,
    };
    if (!userData.uid) {
      throw new Error("UID is required");
    }
    await setDoc(doc(db, "users", userData.uid), userData);
    console.log("Usuario agregado exitosamente al Firestore");
  } catch (error) {
    console.error("Error al agregar usuario a Firestore:", error);
    throw error;
  }
}
// export async function updateUser(user) {
//     try {
//         const userData = {
//             uid: user.uid,
//         };
//         await updateDoc(doc(db, "users", user.uid), userData);
//     } catch (error) {
//         console.error("Error al actualizar usuario en Firestore:", error);
//         throw error;
//     }
// }
export async function getUser(userId) {
  const userDocRef = doc(db, "users", userId);
  try {
    const userDoc = await getDoc(userDocRef);
    const resultado = convertFirebaseTimestampToDate(
      userDoc.data().fecha_nacimiento
    );
    userDoc.data().fecha_nacimiento = resultado;
    if (!userDoc.exists()) {
      throw new Error("El documento del usuario no existe!");
    }
    return userDoc.data();
  } catch (error) {
    console.log(error);
    throw error;
  }
}
/* export async function getRol(uid) {
  const docuRef = doc(db, `usuarios/${uid}`);
  const docuCifrada = await getDoc(docuRef);
  const infoFinal = docuCifrada.data().rol;
  return infoFinal;
} */

export const CursosAdmin = async () => {
  try {
    const cursosRef = collection(db, "cursos");
    const querySnapshot = await getDocs(cursosRef);

    const cursosArray = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const cursoData = doc.data();
        const cursoId = doc.id;

        // Obtener el conteo de documentos en la subcolección "Modulos"
        const modulosRef = collection(doc.ref, "Modulos");
        const modulosSnapshot = await getCountFromServer(modulosRef);
        const modulosCount = modulosSnapshot.data().count;

        return {
          id: cursoId,
          ...cursoData,
          modulosCount: modulosCount,
        };
      })
    );

    // Mantener la estructura similar a CursosInscriptos
    const cursosDetallesArray = cursosArray.map((curso) => ({
      cursoid: curso.id,
      detalles: curso,
    }));

    return cursosDetallesArray;
  } catch (error) {
    console.error("Error en la operación asincrónica:", error);
    throw error;
  }
};
export const CursosInscriptos = async (uid) => {
  try {
    // Realiza la consulta a Firebase
    const miscursosRef = await collection(db, "inscripciones");
    const q = await query(miscursosRef, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    // Extrae los datos de la consulta y actualiza el estado
    const cursosArray = [];
    querySnapshot.forEach((doc) => {
      cursosArray.push({ inscripcionid: doc.id, ...doc.data() });
    });
    // Realiza una segunda consulta para obtener los detalles de cada curso
    const cursosDetallesArray = await Promise.all(
      cursosArray.map(async (curso) => {
        const cursoDetallesRef = doc(db, "cursos", curso.cursoid);
        const cursoDetallesSnapshot = await getDoc(cursoDetallesRef);
        return { ...curso, detalles: cursoDetallesSnapshot.data() };
      })
    );
    return cursosDetallesArray;
  } catch (error) {
    console.error("Error en la operación asincrónica:", error);
  }
};
