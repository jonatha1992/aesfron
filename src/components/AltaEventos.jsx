import React, { useState } from "react";
import { Button, TextField, Box } from "@mui/material";
import { agregarDoc } from "../firebase";
import CardEventoVistaPrevia from "./CardEventoVistaPrevia";
import "../css/eventos.css";

const AltaEventos = () => {
    const [formValues, setFormValues] = useState({
        TITULO: "",
        SUBTITULO: "",
        DESCRIPCION: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        agregarDoc(formValues, "eventos")
            .then((ID) => {
                console.log("Documento escrito con ID: ", ID);
            })
            .catch((error) => {
                console.error("Error al agregar el documento: ", error);
            });
        console.log("Anuncio creado:", formValues);
        setFormValues({
            TITULO: "",
            SUBTITULO: "",
            DESCRIPCION: "",
        });
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
                className="col-5"
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
        </div>
    );
};

export default AltaEventos;
