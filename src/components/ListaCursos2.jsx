import React, { useState, useEffect } from "react";
import { getAllCursos, deleteCurso } from "../controllers/controllerCurso";
import CourseStepperGeneric from "../components/CourseStepperGeneric";
import { List, ListItem, ListItemText, Box, Button, IconButton, Backdrop, CircularProgress } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ListaCursos2 = () => {
    const [cursos, setCursos] = useState([]);
    const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
    const [mostrarLista, setMostrarLista] = useState(true);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

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

    const handleEliminarCurso = async (curso, event) => {
        event.stopPropagation();
        setDeleting(true);
        try {
            console.log("Iniciando eliminación del curso:", curso);
            await deleteCurso(curso.id);
            console.log("Curso eliminado exitosamente");
            toast.success("Curso eliminado con éxito");
            fetchCursos();
        } catch (error) {
            console.error("Error completo al eliminar el curso:", error);
            toast.error(`Error al eliminar el curso: ${error.message}`);
        } finally {
            setDeleting(false);
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
                                }}
                            >
                                <ListItemText primary={curso.title} secondary={curso.description} />
                                <IconButton onClick={(event) => handleSelectCurso(curso)} color="primary">
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={(event) => handleEliminarCurso(curso, event)} color="secondary">
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
        </Box>
    );
};

export default ListaCursos2;
