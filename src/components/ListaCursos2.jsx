import React, { useState, useEffect } from "react";
import { getAllCursos, eliminarCurso } from "../controllers/controllerCurso";
import CourseStepper from "../components/CourseStepper";
import CourseModificationStepper from "./CourseModificationStepper";
import { List, ListItem, ListItemText, Box, Button, IconButton, Backdrop, CircularProgress } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ListaCursos = () => {
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
            await eliminarCurso(curso.id);
            toast.success("Curso eliminado con éxito");
            fetchCursos();
        } catch (error) {
            toast.error("Error al eliminar el curso");
            console.error("Error al eliminar el curso: ", error);
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
                                <IconButton onClick={(event) => handleSelectCurso(curso, event)} color="primary">
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={(event) => handleEliminarCurso(curso, event)} color="secondary">
                                    <DeleteIcon />
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>
                </>
            ) : cursoSeleccionado ? (
                <CourseModificationStepper cursoId={cursoSeleccionado.id} onCursoActualizado={handleCursoActualizado} />
            ) : (
                <CourseStepper />
            )}
        </Box>
    );
};

export default ListaCursos;
