import React, { useState } from "react";
import { Button, TextField, Box, Input, Backdrop, CircularProgress } from "@mui/material";
import { actualizarDoc, eliminarDoc, uploadFiles, deleteFile } from "../firebase";
import CardEventoVistaPrevia from "./CardEventoVistaPrevia";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ModificacionEventos = ({ evento, onEventoActualizado }) => {
    const [formValues, setFormValues] = useState({
        TITULO: evento.TITULO,
        SUBTITULO: evento.SUBTITULO,
        DESCRIPCION: evento.DESCRIPCION,
        IMAGEN: evento.IMAGEN,
    });

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false); // Estado para gestionar el Backdrop

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageURL = event.target.result;
                setFormValues({
                    ...formValues,
                    IMAGEN: imageURL,
                });
            };
            reader.readAsDataURL(file);
            setFile(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Mostrar el Backdrop al iniciar la acción
        try {
            const URL = file ? await uploadFiles(file) : formValues.IMAGEN;
            await deleteFile(evento.IMAGEN);
            await actualizarDoc(evento.id, { ...formValues, IMAGEN: URL }, "eventos");
            toast.success("Evento actualizado con éxito");
        } catch (error) {
            toast.error("Error al actualizar el documento");
            console.error("Error al actualizar el documento: ", error);
        } finally {
            setLoading(false); // Ocultar el Backdrop cuando la acción se complete o falle
        }
    };

    const handleDelete = async () => {
        setLoading(true); // Mostrar el Backdrop al iniciar la acción
        try {
            await eliminarDoc(evento.id, "eventos");
            await deleteFile(evento.IMAGEN);
            toast.success("Evento eliminado con éxito");
            onEventoActualizado();
        } catch (error) {
            toast.error("Error al eliminar el documento");
            console.error("Error al eliminar el documento: ", error);
        } finally {
            setLoading(false); // Ocultar el Backdrop cuando la acción se complete o falle
        }
    };

    return (
        <div className="d-flex">
            <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
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
                    marginTop: "2rem",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                }}
                className="col-5 justify-content-between"
            >
                <h2>Modificar Evento</h2>
                <TextField label="Título" name="TITULO" value={formValues.TITULO} onChange={handleInputChange} required />
                <TextField label="Subtítulo" name="SUBTITULO" value={formValues.SUBTITULO} onChange={handleInputChange} required />
                <TextField
                    label="Descripción"
                    name="DESCRIPCION"
                    value={formValues.DESCRIPCION}
                    onChange={handleInputChange}
                    required
                    multiline
                    rows={4}
                />
                <Input
                    type="file"
                    name="IMAGEN"
                    onChange={handleImageChange}
                    inputProps={{ accept: "image/*" }}
                    sx={{
                        padding: "0.5rem",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                />
                <Box sx={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                    <Button type="submit" variant="contained" color="primary">
                        Actualizar
                    </Button>
                    <Button type="button" variant="contained" color="secondary" onClick={handleDelete}>
                        Eliminar
                    </Button>
                </Box>
            </Box>
            <CardEventoVistaPrevia
                titulo={formValues.TITULO}
                subTitulo={formValues.SUBTITULO}
                imagen={formValues.IMAGEN}
                descripcion={formValues.DESCRIPCION}
            />
            <ToastContainer />
        </div>
    );
};

export default ModificacionEventos;
