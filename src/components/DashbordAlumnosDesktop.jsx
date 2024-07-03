import React, { useState, useContext } from "react";
import { useAuth } from "../context/AuthContext";
import { AlumnosContext } from "../context/AlumnoContext";
import { Settings, AutoStories, Inbox as InboxIcon, ExpandLess, ExpandMore, StarBorder } from "@mui/icons-material";
import MisCursos from "../components/MisCursos";
import MiPerfil from "./MiPerfil";
import AltaCurso from "./AltaCursos";
import ListaCursos from "./ListaCursos";
import ListaModulos from "./ListaModulos";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import AltaAnunciosEventos from "./AltaAnunciosEventos.jsx";
import ListaAnunciosEventos from "./ListaAnunciosEventos.jsx";
import ListaCursos2 from "./ListaCursos2.jsx";

const AltaCursos = () => (
    <div>
        <h2>Alta de Cursos</h2>
        <AltaCurso />
    </div>
);

const BajaCursos = () => (
    <div>
        <h2>Baja de Cursos</h2>
        {/* Agrega tu formulario o funcionalidad aquí */}
    </div>
);

const ModificacionCursos = () => (
    <div>
        <h2>Modificación de Cursos</h2>
        {/* Agrega tu formulario o funcionalidad aquí */}
    </div>
);

const FeatureGrid = () => {
    const { User } = useAuth();
    const { setActiveCourse } = useContext(AlumnosContext);

    const features = [
        {
            name: "Mis Cursos",
            icon: <AutoStories fontSize="large" />,
            route: "/miscursos",
            content: <MisCursos />,
        },
        {
            name: "Perfil",
            icon: <Settings fontSize="large" />,
            route: "/perfil",
            content: <MiPerfil />,
        },
        {
            name: "Cursos",
            icon: <InboxIcon />,
            route: "/alta/cursos",
            content: <AltaCursos />,
        },
        {
            name: "Contenido",
            icon: <InboxIcon />,
            route: "/alta/contenido",
            content: <ListaCursos operacion="alta" />,
        },
        {
            name: "Cursos",
            icon: <InboxIcon />,
            route: "/modificacion/cursos",
            content: <ListaCursos operacion="modCurso" />,
        },
        {
            name: "Contenido",
            icon: <InboxIcon />,
            route: "/modificacion/contenido",
            content: <ListaCursos operacion="modificacion" />,
        },
        {
            name: "Cursos",
            icon: <InboxIcon />,
            route: "/baja/cursos",
            content: <BajaCursos />,
        },
        {
            name: "Eventos",
            icon: <InboxIcon />,
            route: "/gestion",
            content: <ListaAnunciosEventos isEvento={false} />,
        },
        {
            name: "Anuncios",
            icon: <InboxIcon />,
            route: "/gestion",
            content: <ListaAnunciosEventos isEvento={true} />,
        },
        {
            name: "Cursos",
            icon: <InboxIcon />,
            route: "/gestion",
            content: <ListaCursos2 />,
        },
    ];

    const isAdmin = User.rol === "admin";
    const [activeFeature, setActiveFeature] = useState(features[0]);
    const [openCollapse, setOpenCollapse] = useState({});
    const [cursoId, setCursoId] = useState(null);

    const handleFeatureClick = (feature) => {
        setActiveFeature(feature);
        setActiveCourse(null);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
        if (feature.route === "/modificacion/contenido") {
            setCursoId(null); // Reset cursoId cuando se selecciona "Contenido" en modificación
        }
    };

    const handleCursoSelect = (cursoId) => {
        setCursoId(cursoId);
    };

    const handleClick = (section) => {
        setOpenCollapse((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    return (
        <div className="container-fluid" style={{ paddingTop: "5rem" }}>
            <div className="row" style={{ minHeight: "100vh" }}>
                <div
                    className="col-3"
                    style={{
                        borderRadius: "1rem",
                        color: "var(--color3)",
                        background: "var(--color5)",
                    }}
                >
                    <h3
                        style={{
                            textAlign: "start",
                            color: "#606468",
                            paddingTop: "2rem",
                        }}
                    >
                        Bienvenido {User.displayName}.
                    </h3>

                    <List>
                        {features.slice(0, 2).map((feature, index) => (
                            <ListItem
                                disablePadding
                                key={index}
                                onClick={() => handleFeatureClick(feature)}
                                sx={{
                                    background: activeFeature.name === feature.name ? "var(--color2)" : "transparent",
                                    transition: "background 0.3s ease",
                                    "&:hover": {
                                        background: "var(--color2)",
                                        color: "white",
                                    },
                                }}
                            >
                                <ListItemButton>
                                    <ListItemIcon>{feature.icon}</ListItemIcon>
                                    <ListItemText primary={feature.name} sx={{ fontSize: "1.5rem" }} />
                                </ListItemButton>
                            </ListItem>
                        ))}

                        {isAdmin && (
                            <>
                                <Divider />
                                {["ALTA", "MODIFICACION", "BAJA", "GESTION"].map((section) => (
                                    <div key={section}>
                                        <ListItemButton onClick={() => handleClick(section)}>
                                            <ListItemIcon>
                                                <InboxIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={section} />
                                            {openCollapse[section] ? <ExpandLess /> : <ExpandMore />}
                                        </ListItemButton>
                                        <Collapse in={openCollapse[section]} timeout="auto" unmountOnExit>
                                            <List component="div" disablePadding>
                                                {features
                                                    .filter((feature) => feature.route.startsWith(`/${section.toLowerCase()}`))
                                                    .map((feature, index) => (
                                                        <ListItemButton
                                                            key={index}
                                                            onClick={() => handleFeatureClick(feature)}
                                                            sx={{
                                                                pl: 4,
                                                                background:
                                                                    activeFeature.name === feature.name ? "var(--color2)" : "transparent",
                                                                transition: "background 0.3s ease",
                                                                "&:hover": {
                                                                    background: "var(--color2)",
                                                                    color: "white",
                                                                },
                                                            }}
                                                        >
                                                            <ListItemIcon>
                                                                <StarBorder />
                                                            </ListItemIcon>
                                                            <ListItemText primary={feature.name} />
                                                        </ListItemButton>
                                                    ))}
                                            </List>
                                        </Collapse>
                                    </div>
                                ))}
                            </>
                        )}
                    </List>
                </div>
                <div
                    className="col-9 flex-column"
                    style={{
                        display: "flex",
                    }}
                >
                    {activeFeature.route === "/modificacion/contenido" && cursoId ? (
                        <ListaModulos cursoId={cursoId} />
                    ) : (
                        activeFeature.content
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeatureGrid;
