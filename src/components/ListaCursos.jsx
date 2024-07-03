import React, { useEffect, useState } from "react";
import { getAllCursos } from "../controllers/controllerCurso"; // Ajusta la importación según tu configuración
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ListaModulos from "./ListaModulos";
import AltaModulos from "./AltaModulos";
import CourseModificationStepper from "../componentesviejos/CourseModificationStepper";

export default function ListaCursos({ operacion }) {
    const [cursos, setCursos] = useState([]);
    const [cursoSeleccionado, setCursoSeleccionado] = useState("");

    useEffect(() => {
        const fetchCursos = async () => {
            try {
                // Obtiene la lista de cursos desde Firestore o tu backend
                const cursosData = await getAllCursos("cursos"); // Ajusta esta función según tu implementación
                setCursos(cursosData);
            } catch (error) {
                console.error("Error al obtener la lista de cursos:", error);
            }
        };

        fetchCursos();
    }, []);

    const handleChangeCurso = (event) => {
        setCursoSeleccionado(event.target.value);
    };

    return (
        <Box>
            <FormControl fullWidth>
                <Select
                    value={cursoSeleccionado}
                    onChange={handleChangeCurso}
                    displayEmpty
                    inputProps={{ "aria-label": "Seleccionar Curso" }}
                >
                    <MenuItem value="" disabled>
                        Selecciona un curso
                    </MenuItem>
                    {cursos.map((curso) => (
                        <MenuItem key={curso.id} value={curso.id}>
                            {curso.title}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {cursoSeleccionado &&
                (operacion === "modificacion" ? (
                    <ListaModulos cursoId={cursoSeleccionado} />
                ) : operacion === "modCurso" ? (
                    <CourseModificationStepper cursoId={cursoSeleccionado} />
                ) : (
                    <AltaModulos cursoId={cursoSeleccionado} />
                ))}
        </Box>
    );
}
