import React, { useState, useEffect } from "react";
import { deleteFile } from "../controllers/controllerFile";
import { obtenerRecientes, eliminarDoc } from "../firebase";
import ModificacionAnuncioEventos from "./ModificacionAnuncioEventos";
import {
    List,
    ListItem,
    ListItemText,
    Box,
    Button,
    IconButton,
    Backdrop,
    CircularProgress,
    Avatar,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ListaAnunciosEventos = ({ isEvento = false }) => {
    const [documentos, setDocumentos] = useState([]);
    const [documentoSeleccionado, setDocumentoSeleccionado] = useState(null);
    const [mostrarLista, setMostrarLista] = useState(true);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [documentoToDelete, setDocumentoToDelete] = useState(null);

    const tipoDocumento = isEvento ? "eventos" : "anuncios";
    const nombreSingular = isEvento ? "Evento" : "Anuncio";
    const nombrePlural = isEvento ? "Eventos" : "Anuncios";

    const fetchDocumentos = async () => {
        setLoading(true);
        try {
            const documentosRecientes = await obtenerRecientes(10, tipoDocumento);
            setDocumentos(documentosRecientes);
        } catch (error) {
            console.error(`Error al obtener ${nombrePlural.toLowerCase()}: `, error);
            toast.error(`Error al cargar ${nombrePlural.toLowerCase()}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocumentos();
    }, [tipoDocumento]);

    const handleSelectDocumento = (documento) => {
        setDocumentoSeleccionado(documento);
        setMostrarLista(false);
    };

    const handleDocumentoActualizado = (mensaje) => {
        fetchDocumentos();
        setMostrarLista(true);
        if (mensaje) {
            toast.success(mensaje);
        }
    };

    const handleNuevoDocumento = () => {
        setDocumentoSeleccionado(null);
        setMostrarLista(false);
    };

    const handleEliminarDocumentoClick = (documento, event) => {
        event.stopPropagation();
        setDocumentoToDelete(documento);
        setOpenDeleteDialog(true);
    };

    const handleEliminarDocumentoConfirm = async () => {
        if (documentoToDelete) {
            setDeleting(true);
            try {
                await eliminarDoc(documentoToDelete.id, tipoDocumento);
                await deleteFile(documentoToDelete.IMAGEN);
                toast.success(`${nombreSingular} eliminado con éxito`);
                fetchDocumentos();
            } catch (error) {
                toast.error(`Error al eliminar el ${nombreSingular.toLowerCase()}`);
                console.error(`Error al eliminar el ${nombreSingular.toLowerCase()}: `, error);
            } finally {
                setDeleting(false);
                setOpenDeleteDialog(false);
                setDocumentoToDelete(null);
            }
        }
    };

    const handleDeleteCancel = () => {
        setOpenDeleteDialog(false);
        setDocumentoToDelete(null);
    };

    return (
        <Box>
            <ToastContainer autoClose={2000} />
            <Backdrop open={loading || deleting} style={{ zIndex: 9999, color: "#fff" }}>
                <CircularProgress color="inherit" />
            </Backdrop>
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
                                {documento.IMAGEN && (
                                    <Avatar
                                        src={documento.IMAGEN}
                                        alt={documento.IMAGEN}
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            marginRight: 1,
                                            cursor: "pointer",
                                        }}
                                    />
                                )}
                                <ListItemText primary={documento.TITULO} secondary={documento.SUBTITULO} />
                                <IconButton onClick={(event) => handleSelectDocumento(documento, event)} color="primary">
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={(event) => handleEliminarDocumentoClick(documento, event)} color="secondary">
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
            <Dialog
                open={openDeleteDialog}
                onClose={handleDeleteCancel}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{`Confirmar eliminación de ${nombreSingular}`}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        ¿Estás seguro de que quieres eliminar el {nombreSingular.toLowerCase()} "{documentoToDelete?.TITULO}"?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>Cancelar</Button>
                    <Button onClick={handleEliminarDocumentoConfirm} autoFocus>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ListaAnunciosEventos;
