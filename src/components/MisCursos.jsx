import React, { useEffect, useState, useContext } from "react";
import { AlumnosContext } from "../context/AlumnoContext";
import { useAuth } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import UnidadesCursos from "./UnidadesCursos";
import Breadcrumbs from "./Breadcrumbs";
import { Link } from "react-router-dom";
import { Backdrop, CircularProgress } from "@mui/material";

const MisCursos = () => {
    const { cursos, activeCourse, setActiveCourse } = useContext(AlumnosContext);
    const [loading, setLoading] = useState(true);

    const handleCursoClick = (curso) => {
        setActiveCourse(curso);
    };

    useEffect(() => {
        const simulateLoading = async () => {
            console.log("Inicio de la carga simulada");
            setLoading(true);
            // Simular una carga de 2 segundos
            await new Promise((resolve) => setTimeout(resolve, 1500));
            console.log("Fin de la carga simulada");
            setLoading(false);
            setActiveCourse(null);
            window.scrollTo(0, 0);
        };

        simulateLoading();
    }, []);

    if (loading) {
        console.log("Renderizando Backdrop");
        return (
            <Backdrop open={true} style={{ zIndex: 9999, color: "#fff" }}>
                <CircularProgress color="inherit" />
            </Backdrop>
        );
    }

    console.log("Renderizando contenido principal");

    return (
        <div className="contenido-container">
            <Breadcrumbs />
            {cursos.length === 0 ? (
                <div>
                    <div className="no-cursos-message">
                        <p>No estás inscrito en ningún curso. ¡Inscríbete a uno!</p>
                        <Link to="/#seccion3" className="text-primary hover-primary ">
                            Ver cursos
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="d-flex justify-content-start flex-column">
                    {activeCourse ? (
                        <UnidadesCursos activeCourse={activeCourse} />
                    ) : (
                        <div className="container d-flex flex-column" style={{ height: "100vh" }}>
                            <div className="container-miscursos" style={{ color: "black", paddingTop: "" }}>
                                {cursos.map((curso, index) => (
                                    <div key={index} className="miscursos-item" onClick={() => handleCursoClick(curso)}>
                                        <div
                                            className="blur-background"
                                            style={{
                                                backgroundImage: `url(${curso.detalles.imageUrl})`,
                                            }}
                                        >
                                            <div className="content d-flex">
                                                <span
                                                    style={{
                                                        width: "70%",
                                                        fontSize: "1rem",
                                                        textAlign: "start",
                                                        color: "#606468",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {curso.detalles.title}
                                                </span>
                                                <div
                                                    className="info-micurso"
                                                    style={{
                                                        width: "30%",
                                                        textAlign: "end",
                                                        fontSize: "10px",
                                                    }}
                                                >
                                                    <span>{curso.detalles.modulosCount} Módulos</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MisCursos;
