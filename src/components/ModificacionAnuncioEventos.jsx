import React, { useState, useEffect } from "react";
import { Button, TextField, Box, Input, Backdrop, CircularProgress, Card } from "@mui/material";
import { agregarDoc, actualizarDoc, eliminarDoc } from "../firebase";
import { uploadFiles, deleteFile } from "../controllers/controllerFile";
import CardEventoVistaPrevia from "./CardEventoVistaPrevia";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const defaultImageURL =
    "https://firebasestorage.googleapis.com/v0/b/aesfron-69a52.appspot.com/o/falta_imagen.jpg?alt=media&token=b3729570-6216-42c5-9bfa-98ba98e6c2a5";

const ModificacionAnuncioEventos = ({ documento = null, onDocumentoActualizado, isEvento = false }) => {
    const [formValues, setFormValues] = useState({
        TITULO: "",
        SUBTITULO: "",
        DESCRIPCION: "",
        IMAGEN: defaultImageURL,
    });

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (documento) {
            setFormValues({
                TITULO: documento.TITULO,
                SUBTITULO: documento.SUBTITULO,
                DESCRIPCION: documento.DESCRIPCION,
                IMAGEN: documento.IMAGEN,
            });
        }
        setLoading(false);
    }, [documento]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setFormValues({
                    ...formValues,
                    IMAGEN: event.target.result,
                });
            };
            reader.readAsDataURL(file);
            setFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const URL = file ? await uploadFiles(file) : formValues.IMAGEN;
            const collectionName = isEvento ? "eventos" : "anuncios";

            if (documento) {
                if (file) await deleteFile(documento.IMAGEN);
                await actualizarDoc(documento.id, { ...formValues, IMAGEN: URL }, collectionName);
                if (onDocumentoActualizado) onDocumentoActualizado(`${isEvento ? "Evento" : "Anuncio"} actualizado con éxito`);
            } else {
                const newDoc = await agregarDoc({ ...formValues, IMAGEN: URL }, collectionName);
                if (onDocumentoActualizado) onDocumentoActualizado(`${isEvento ? "Evento" : "Anuncio"} creado con éxito`);
                setFormValues({
                    TITULO: "",
                    SUBTITULO: "",
                    DESCRIPCION: "",
                    IMAGEN: defaultImageURL,
                });
                setFile(null);
            }
        } catch (error) {
            if (onDocumentoActualizado) onDocumentoActualizado(null);
            toast.error(`Error al ${documento ? "actualizar" : "agregar"} el ${isEvento ? "evento" : "anuncio"}`, { autoClose: 2000 });
            console.error(`Error al ${documento ? "actualizar" : "agregar"} el ${isEvento ? "evento" : "anuncio"}: `, error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!documento) return;
        setLoading(true);
        try {
            const collectionName = isEvento ? "eventos" : "anuncios";
            await eliminarDoc(documento.id, collectionName);
            await deleteFile(documento.IMAGEN);
            toast.success(`${isEvento ? "Evento" : "Anuncio"} eliminado con éxito`, { autoClose: 2000 });
            if (onDocumentoActualizado) onDocumentoActualizado();
        } catch (error) {
            toast.error(`Error al eliminar el ${isEvento ? "evento" : "anuncio"}`, { autoClose: 2000 });
            console.error(`Error al eliminar el ${isEvento ? "evento" : "anuncio"}: `, error);
        } finally {
            setLoading(false);
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
                    marginTop: "1rem",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                }}
                className="col-5 justify-content-between"
            >
                <h2>{documento ? `Modificar ${isEvento ? "Evento" : "Anuncio"}` : `Alta de ${isEvento ? "Evento" : "Anuncio"}`}</h2>
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
                    required={!documento}
                    sx={{
                        padding: "0.5rem",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                />
                <Box sx={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                    <Button type="submit" variant="contained" color="primary">
                        {documento ? "Actualizar" : `Crear ${isEvento ? "Evento" : "Anuncio"}`}
                    </Button>
                    {documento && (
                        <Button type="button" variant="contained" color="secondary" onClick={handleDelete}>
                            Eliminar
                        </Button>
                    )}
                </Box>
            </Box>
            <CardEventoVistaPrevia
                titulo={formValues.TITULO}
                subTitulo={formValues.SUBTITULO}
                imagen={formValues.IMAGEN}
                descripcion={formValues.DESCRIPCION}
            />
        </div>
    );
};

export default ModificacionAnuncioEventos;
