import React, { useState, useEffect } from "react";
import { getAllCursos, deleteCurso } from "../controllers/controllerCurso";
import { actualizarDoc } from "../firebase";
import CourseStepperGeneric from "./CourseStepperGeneric";
import {
    List,
    ListItem,
    ListItemText,
    Box,
    Button,
    IconButton,
    Backdrop,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Switch,
    Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Avatar from "@mui/material/Avatar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ListaCursos = () => {
    const [cursos, setCursos] = useState([]);
    const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
    const [mostrarLista, setMostrarLista] = useState(true);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [cursoToDelete, setCursoToDelete] = useState(null);

    const fetchCursos = async () => {
        setLoading(true);
        try {
            const cursosData = await getAllCursos("cursos");
            setCursos(cursosData);
        } catch (error) {
            console.error("Error al obtener cursos: ", error);
            toast.error("Error al cargar cursos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCursos();
    }, []);

    const handleSelectCurso = (curso) => {
        setCursoSeleccionado(curso);
        setMostrarLista(false);
    };

    const handleCursoActualizado = (mensaje) => {
        fetchCursos();
        setMostrarLista(true);
        setCursoSeleccionado(null);
        if (mensaje) {
            toast.success(mensaje);
        }
    };

    const handleNuevoCurso = () => {
        setCursoSeleccionado(null);
        setMostrarLista(false);
    };

    const handleEliminarCursoClick = (curso, event) => {
        event.stopPropagation();
        setCursoToDelete(curso);
        setOpenDeleteDialog(true);
    };

    const handleEliminarCursoConfirm = async () => {
        if (cursoToDelete) {
            setDeleting(true);
            try {
                console.log("Iniciando eliminación del curso:", cursoToDelete);
                await deleteCurso(cursoToDelete.id);
                console.log("Curso eliminado exitosamente");
                toast.success("Curso eliminado con éxito");
                fetchCursos();
            } catch (error) {
                console.error("Error completo al eliminar el curso:", error);
                toast.error(`Error al eliminar el curso: ${error.message}`);
            } finally {
                setDeleting(false);
                setOpenDeleteDialog(false);
                setCursoToDelete(null);
            }
        }
    };

    const handleDeleteCancel = () => {
        setOpenDeleteDialog(false);
        setCursoToDelete(null);
    };

    const handleHabilitadoChange = async (curso, event) => {
        const newHabilitado = event.target.checked;
        try {
            await actualizarDoc(curso.id, { habilitado: newHabilitado }, "cursos");
            setCursos(cursos.map((c) => (c.id === curso.id ? { ...c, habilitado: newHabilitado } : c)));
            toast.success(`Curso ${newHabilitado ? "habilitado" : "deshabilitado"} con éxito`);
        } catch (error) {
            console.error("Error al actualizar el estado del curso:", error);
            toast.error("Error al actualizar el estado del curso");
        }
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
                    <h2 className="mt-4">Cursos</h2>
                    <Button variant="contained" color="primary" onClick={handleNuevoCurso} sx={{ margin: "5px 0" }}>
                        Crear Nuevo Curso
                    </Button>
                    <List>
                        {cursos.map((curso) => (
                            <ListItem
                                key={curso.id}
                                sx={{
                                    borderRadius: "8px",
                                    border: "1px solid var(--color1)",
                                    margin: "8px 0",
                                    transition: "background 0.3s ease",
                                    "&:hover": {
                                        background: "var(--color2)",
                                        color: "white",
                                    },
                                    opacity: curso.habilitado ? 1 : 0.5,
                                }}
                            >
                                {curso.imageUrl && (
                                    <Avatar
                                        src={curso.imageUrl}
                                        alt={curso.title}
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            marginRight: 1,
                                            cursor: "pointer",
                                        }}
                                    />
                                )}
                                <ListItemText
                                    primary={curso.title}
                                    secondary={`${curso.description} - ${curso.habilitado ? "Habilitado" : "Deshabilitado"}`}
                                />
                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mr: 2 }}>
                                    <Typography variant="caption" sx={{ mb: 0.5 }}>
                                        {curso.habilitado ? "Habilitado" : "Deshabilitado"}
                                    </Typography>
                                    <Switch
                                        checked={curso.habilitado}
                                        onChange={(event) => handleHabilitadoChange(curso, event)}
                                        color="primary"
                                    />
                                </Box>
                                <IconButton onClick={() => handleSelectCurso(curso)} color="primary">
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={(event) => handleEliminarCursoClick(curso, event)} color="secondary">
                                    <DeleteIcon />
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>
                </>
            ) : (
                <CourseStepperGeneric
                    cursoId={cursoSeleccionado ? cursoSeleccionado.id : null}
                    onCursoActualizado={handleCursoActualizado}
                />
            )}
            <Dialog
                open={openDeleteDialog}
                onClose={handleDeleteCancel}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirmar eliminación"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        ¿Estás seguro de que quieres eliminar el curso "{cursoToDelete?.title}"?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>Cancelar</Button>
                    <Button onClick={handleEliminarCursoConfirm} autoFocus>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ListaCursos;
