import React, { useState, useEffect } from "react";
import { obtenerRecientes, eliminarDoc, deleteFile } from "../firebase"; // Asegúrate de que estas rutas sean correctas
import ModificacionAnuncioEventos from "./ModificacionAnuncioEventos";
import { List, ListItem, ListItemText, Box, Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ListaAnunciosEventos = ({ isEvento = false }) => {
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

    const handleEliminarDocumento = async (documento, event) => {
        event.stopPropagation();
        try {
            await eliminarDoc(documento.id, tipoDocumento);
            await deleteFile(documento.IMAGEN);
            toast.success(`${nombreSingular} eliminado con éxito`);
            fetchDocumentos();
        } catch (error) {
            toast.error(`Error al eliminar el ${nombreSingular.toLowerCase()}`);
            console.error(`Error al eliminar el ${nombreSingular.toLowerCase()}: `, error);
        }
    };

    return (
        <Box>
            <ToastContainer />
            {!mostrarLista && (
                <Button variant="contained" color="secondary" onClick={() => setMostrarLista(true)} sx={{ margin: "5px 0" }}>
                    Volver a la lista
                </Button>
            )}
            {mostrarLista ? (
                <>
                    <h2 className="mt-4">{nombrePlural} Recientes</h2>
                    <Button variant="contained" color="primary" onClick={handleNuevoDocumento} sx={{ margin: "5px 0" }}>
                        Crear Nuevo {nombreSingular}
                    </Button>
                    <List>
                        {documentos.map((documento) => (
                            <ListItem
                                key={documento.id}
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
                                <IconButton onClick={(event) => handleSelectDocumento(documento, event)} color="primary">
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={(event) => handleEliminarDocumento(documento, event)} color="secondary">
                                    <DeleteIcon />
                                </IconButton>
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
        </Box>
    );
};

export default ListaAnunciosEventos;
