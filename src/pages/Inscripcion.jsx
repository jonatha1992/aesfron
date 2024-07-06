import React, { useState, useEffect, useContext } from "react";
import "../css/Inscripcion.css";
import { useParams, useNavigate } from "react-router-dom";
import { getCurso } from "../controllers/controllerCurso";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import axios from "axios";
import { Modal, Backdrop, CircularProgress, Button, Box, Skeleton } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { AlumnosContext } from "../context/AlumnoContext";
import AcordeonUnidades from "../components/AcordeonUnidades";

export default function Inscripcion() {
    const { User } = useAuth();
    const { cursoid } = useParams();
    const [curso, setCurso] = useState(null);
    const [preferenceId, setPreferenceId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cursoRepetido, setCursoRepetido] = useState(false);
    const { cursos } = useContext(AlumnosContext);
    const navigate = useNavigate();

    initMercadoPago("APP_USR-7fe0b0e9-71a3-4456-9e78-29d26e02b522", {
        locale: "es-AR",
    });

    const createPreference = async () => {
        try {
            if (!User || !User.uid) {
                console.log("El usuario no está autenticado. No se creará la preferencia.");
                navigate(`/login?from=/inscripcion/${cursoid}`);
                return;
            }
            setLoading(true);
            const response = await axios.post("https://us-central1-aesfron-69a52.cloudfunctions.net/app/create_preference", {
                description: curso.title,
                title: "AESFRON",
                price: curso.price,
                quantity: 1,
                cursoid: cursoid,
                uid: User.uid,
            });

            const { id } = response.data;
            return id;
        } catch (error) {
            console.log("bandera", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBuy = async () => {
        const existe = cursos.some((item) => item.cursoid === cursoid);

        if (existe) {
            setCursoRepetido(true);
        } else {
            const id = await createPreference();
            if (id) {
                setPreferenceId(id);
            }
        }
    };

    useEffect(() => {
        const fetchCurso = async () => {
            try {
                const cursoData = await getCurso(cursoid);
                setCurso(cursoData);
            } catch (error) {
                console.error("Error al obtener detalles del curso", error);
            }
        };

        if (cursoid) {
            fetchCurso();
        }
    }, [cursoid]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [cursoid]);

    if (!curso) {
        return (
            <Box sx={{ width: 300 }}>
                <Skeleton />
                <Skeleton animation="wave" />
                <Skeleton animation={false} />
            </Box>
        );
    }

    const customization = {
        visual: {
            buttonBackground: "black",
            buttonHeight: "68px",
        },
    };

    return (
        <div className="fondo-panta">
            <div className="header-inscripcion">
                <div className="d-flex flex-column">
                    <div className="info-inscripcion">
                        <h2 className="fw-bold">{curso.title}</h2>
                        <div>
                            <Button
                                className="d-inline-block align-baseline fw-bold hover-primary mt-2 bg-gradient"
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                onClick={handleBuy}
                                style={{ width: "50%" }}
                            >
                                {/* <h3>${curso.price.toLocaleString("es-AR")} ARS</h3> */}
                                INSCRIBITE🔽
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="contenedor-imagen-curso" style={{ padding: "1rem" }}>
                    <img src={curso.imageUrl} alt="" />
                </div>
            </div>

            <Modal
                open={loading}
                BackdropComponent={Backdrop}
                onClose={() => setLoading(false)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <CircularProgress color="primary" />
            </Modal>

            {preferenceId && !cursoRepetido && (
                <Modal
                    open={!loading}
                    onClose={() => setPreferenceId(null)}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <div
                        style={{
                            maxWidth: "400px",
                            padding: "20px",
                            background: "#fff",
                            borderRadius: "8px",
                        }}
                    >
                        {/* Resumen de la operación */}
                        <h3>Confirmacion</h3>
                        <p>Curso: {curso.title}</p>
                        <p>Precio: {curso.price}</p>

                        {/* Componente Wallet */}
                        <div style={{ marginTop: "20px" }}>
                            <Wallet initialization={{ preferenceId }} customization={customization} />
                        </div>
                    </div>
                </Modal>
            )}

            {cursoRepetido && (
                <Modal
                    open={!loading}
                    onClose={() => setCursoRepetido(false)}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <div
                        style={{
                            maxWidth: "400px",
                            padding: "20px",
                            background: "#fff",
                            borderRadius: "8px",
                        }}
                    >
                        <h3>¡Ya estás inscrito!</h3>
                        <p>Ya te encuentras inscrito en este curso.</p>
                        <button
                            onClick={() => {
                                navigate("/alumnos");
                                setCursoRepetido(false);
                            }}
                        >
                            Ir a Alumnos
                        </button>
                    </div>
                </Modal>
            )}

            <div className="body-inscripcion d-flex flex-wrap justify-content-between">
                <div className="col-12">
                    <h2 className="fs-3">Objetivo General</h2>
                    <p className="fs-6">{curso.description}</p>
                </div>
                <div className="col-12 ">
                    <h2 className="fs-3">Objetivos Particulares</h2>

                    <ul className="fs-6">
                        {curso.objetivos.map((objetivo, index) => (
                            <li key={index}>{objetivo}</li>
                        ))}
                    </ul>
                </div>
                <div className="col-12 col-md-6">
                    <h2 className="fs-3">Contenido</h2>
                    <AcordeonUnidades cursoid={cursoid} />
                </div>
                <div className="col-12 col-md-5">
                    <h2 className="fs-3">Detalles</h2>
                    <div className="row">
                        <div className="col-6 ">
                            <h3>
                                Coordinación<p className="mt-1">{curso.coordinacion}</p>
                            </h3>
                        </div>
                        <div className="col-6 ">
                            <h3>
                                Clases<p className="mt-1">{curso.classes}</p>
                            </h3>
                        </div>
                        <div className="col-6">
                            <h3>
                                Docentes
                                <ul className="mt-1">
                                    {curso.disertantes.map((disertante, index) => (
                                        <li key={index}>{disertante}</li>
                                    ))}
                                </ul>
                            </h3>
                        </div>
                        <div className="col-6 ">
                            <h3>
                                Modalidad<p className="mt-1">{curso.modalidad}</p>
                            </h3>
                        </div>
                        <div className="col-6">
                            <h3>
                                Carga Horaria<p className="mt-1">{curso.workload + " Horas"}</p>
                            </h3>
                        </div>
                        <div className="col-6 ">
                            <h3>
                                Evaluacion<p className="mt-1">{curso.test}</p>
                            </h3>
                        </div>
                        <div className="col-6">
                            <h3>
                                Duración<p className="mt-1">{curso.duration}</p>
                            </h3>
                        </div>
                        <div className="col-6 ">
                            <h3>
                                Mail de contacto<p className="mt-1">{curso.mail}</p>
                            </h3>
                        </div>
                        <div className="col-6">
                            <h3>
                                Inicio<p className="mt-1">{curso.start}</p>
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
