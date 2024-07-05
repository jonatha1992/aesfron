import React, { useEffect, useState, useContext } from "react";
import { AlumnosContext } from "../context/AlumnoContext";
import { useAuth } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import UnidadesCursos from "./UnidadesCursos";
import Breadcrumbs from "./Breadcrumbs";
import { Link } from "react-router-dom";

const MisCursos = () => {
  const { cursos, activeCourse, setActiveCourse } = useContext(AlumnosContext);
  const handleCursoClick = (curso) => {
    setActiveCourse(curso);
  };

  useEffect(() => {
    setActiveCourse(null);
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="contenido-container">
      <Breadcrumbs />
      {cursos.length === 0 ? (
        <div>
          <div className="no-cursos-message">
            <p>No estás inscrito en ningún curso. inscribite a uno!</p>
            <Link to="/#seccion3" className="text-primary hover-primary ">
              Ver cursos
            </Link>
          </div>
        </div>
      ) : (
        <div className=" d-flex justify-content-start flex-column">
          {activeCourse ? (
            <UnidadesCursos activeCourse={activeCourse} />
          ) : (
            <div
              className="container d-flex flex-column"
              style={{ height: "100vh" }}
            >
              <div
                className="container-miscursos"
                style={{ color: "black", paddingTop: "" }}
              >
                {cursos.map((curso, index) => (
                  <div
                    key={index}
                    className="miscursos-item"
                    onClick={() => handleCursoClick(curso)}
                  >
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
                          <span>25 contenidos sin ver</span>
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
