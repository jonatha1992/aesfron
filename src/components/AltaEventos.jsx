import React, { useState } from "react";
import { Button, TextField, Box } from "@mui/material";
import { agregarDoc } from "../firebase";
import CardEventoVistaPrevia from "./CardEventoVistaPrevia";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/eventos.css";

const AltaEventos = () => {
    const [formValues, setFormValues] = useState({
        TITULO: "",
        SUBTITULO: "",
        DESCRIPCION: "",
        IMAGEN: "",
    });

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
            const ID = await agregarDoc(formValues, "eventos");
            toast.success("Evento creado con éxito");
            console.log("Documento escrito con ID: ", ID);
            setFormValues({
                TITULO: "",
                SUBTITULO: "",
                DESCRIPCION: "",
            });
        } catch (error) {
            toast.error("Error al agregar el documento");
            console.error("Error al agregar el documento: ", error);
        }
    };

    return (
        <div className="d-flex">
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
                <h2>Alta de Eventos</h2>
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
                <Button type="submit" variant="contained" color="primary">
                    Crear Anuncio
                </Button>
            </Box>
            <CardEventoVistaPrevia titulo={formValues.TITULO} subTitulo={formValues.SUBTITULO} descripcion={formValues.DESCRIPCION} />
            <ToastContainer />
        </div>
    );
};

export default AltaEventos;
