import React, { useState, useEffect } from "react";
import { Button, TextField, Box } from "@mui/material";
import { actualizarDoc, doc, getDoc, db } from "../firebase"; // Asegúrate de que esta ruta sea correcta

const ModificacionEventos = ({ eventoID, onEventoActualizado }) => {
  const [formValues, setFormValues] = useState({
    TITULO: "",
    SUBTITULO: "",
    DESCRIPCION: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "eventos", eventoID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFormValues(docSnap.data());
      } else {
        console.log("No se encontró el documento!");
      }
    };

    fetchData();
  }, [eventoID]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await actualizarDoc(eventoID, formValues, "eventos");
      console.log("Documento actualizado con ID: ", eventoID);
      onEventoActualizado();
    } catch (error) {
      console.error("Error al actualizar el documento: ", error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        maxWidth: "500px",
        margin: "0 auto",
        padding: "2rem",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2>Modificar Evento</h2>
      <TextField
        label="Título"
        name="TITULO"
        value={formValues.TITULO}
        onChange={handleInputChange}
        required
      />
      <TextField
        label="Subtítulo"
        name="SUBTITULO"
        value={formValues.SUBTITULO}
        onChange={handleInputChange}
        required
      />
      <TextField
        label="Descripción"
        name="DESCRIPCION"
        value={formValues.DESCRIPCION}
        onChange={handleInputChange}
        required
        multiline
        rows={4}
      />
      <Button type="submit" variant="contained" color="primary">
        Actualizar Evento
      </Button>
    </Box>
  );
};

export default ModificacionEventos;
