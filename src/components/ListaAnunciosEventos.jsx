import React, { useState, useEffect } from "react";
import { obtenerRecientes } from "../firebase"; // Asegúrate de que esta ruta sea correcta
import ModificacionAnuncioEventos from "./ModificacionAnuncioEventos";
import { List, ListItem, ListItemText, Box, Button } from "@mui/material";

const ListaEventos = ({ isEvento = false }) => {
    const [documentos, setDocumentos] = useState([]);
    const [documentoSeleccionado, setDocumentoSeleccionado] = useState(null);
    const [mostrarLista, setMostrarLista] = useState(true);

    const tipoDocumento = isEvento ? "eventos" : "anuncios";
    const nombreSingular = isEvento ? "Evento" : "Anuncio";
    const nombrePlural = isEvento ? "Eventos" : "Anuncios";

    const fetchDocumentos = async () => {
        const documentosRecientes = await obtenerRecientes(10, tipoDocumento);
        setDocumentos(documentosRecientes);
    };

    useEffect(() => {
        fetchDocumentos();
    }, [tipoDocumento]);

    const handleSelectDocumento = (documento) => {
        setDocumentoSeleccionado(documento);
        setMostrarLista(false);
    };

    const handleDocumentoActualizado = () => {
        fetchDocumentos();
        setMostrarLista(true);
    };

    const handleNuevoDocumento = () => {
        setDocumentoSeleccionado(null);
        setMostrarLista(false);
    };

    return (
        <Box>
            {mostrarLista ? (
                <>
                    <h2 className="mt-4">{nombrePlural} Recientes</h2>
                    <Button variant="contained" color="primary" onClick={handleNuevoDocumento} sx={{ margin: "16px 0" }}>
                        Crear Nuevo {nombreSingular}
                    </Button>
                    <List>
                        {documentos.map((documento) => (
                            <ListItem
                                button
                                key={documento.id}
                                onClick={() => handleSelectDocumento(documento)}
                                sx={{
                                    borderRadius: "8px",
                                    border: "1px solid var(--color1)",
                                    margin: "8px 0",
                                    transition: "background 0.3s ease",
                                    "&:hover": {
                                        background: "var(--color2)",
                                        color: "white",
                                    },
                                }}
                            >
                                <ListItemText primary={documento.TITULO} secondary={documento.SUBTITULO} />
                            </ListItem>
                        ))}
                    </List>
                </>
            ) : (
                <ModificacionAnuncioEventos
                    documento={documentoSeleccionado}
                    onDocumentoActualizado={handleDocumentoActualizado}
                    isEvento={isEvento}
                />
            )}
            {!mostrarLista && (
                <Button variant="contained" color="secondary" onClick={() => setMostrarLista(true)} sx={{ margin: "16px 0" }}>
                    Volver a la lista
                </Button>
            )}
        </Box>
    );
};

export default ListaDocumentos;
