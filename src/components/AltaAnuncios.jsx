import React, { useState } from "react";
import { Button, TextField, Box, Input } from "@mui/material";
import { agregarDoc } from "../firebase";
import CardEventoVistaPrevia from "./CardEventoVistaPrevia";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const defaultImageURL =
    "https://firebasestorage.googleapis.com/v0/b/aesfron-69a52.appspot.com/o/falta_imagen.jpg?alt=media&token=b3729570-6216-42c5-9bfa-98ba98e6c2a5";

const AltaAnuncios = () => {
    const [formValues, setFormValues] = useState({
        TITULO: "",
        SUBTITULO: "",
        DESCRIPCION: "",
        IMAGEN: defaultImageURL,
    });
    const [file, setFile] = useState(null);

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
        try {
            const URL = await uploadFiles(file);
            console.log("URL: ", URL);
            setFormValues({
                ...formValues,
                IMAGEN: URL,
            });
            const ID = await agregarDoc({ ...formValues, IMAGEN: URL }, "eventos");
            toast.success("Evento creado con éxito");
            console.log("Documento escrito con ID: ", ID);
            setFormValues({
                TITULO: "",
                SUBTITULO: "",
                DESCRIPCION: "",
                IMAGEN: defaultImageURL,
            });
            setFile(null);
        } catch (error) {
            toast.error("Error al agregar el documento");
            console.error("Error al agregar el documento: ", error);
        }
    };
    return (
        <div className="d-flex  ">
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
                <h2>Alta de Anuncios</h2>
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
                    required
                    accept="image/*"
                    sx={{
                        padding: "0.5rem",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                />
                <Button type="submit" variant="contained" color="primary">
                    Crear Anuncio
                </Button>
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

export default AltaAnuncios;
