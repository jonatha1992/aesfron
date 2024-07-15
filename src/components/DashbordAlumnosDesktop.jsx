import React, { useState, useContext, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { AlumnosContext } from "../context/AlumnoContext";
import { Settings, AutoStories, Inbox as InboxIcon, ExpandLess, ExpandMore, Business } from "@mui/icons-material";
import MisCursos from "../components/MisCursos";
import MiPerfil from "./MiPerfil";
import ComboCursos from "./ComboCursos";
import ListaModulos from "./ListaModulos";
import ListaAnunciosEventos from "./ListaAnunciosEventos.jsx";
import ListaCursos from "./ListaCursos.jsx";
import FolderIcon from "@mui/icons-material/Folder";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, Divider } from "@mui/material";

const FeatureGrid = () => {
    const { User } = useAuth();
    const { setActiveCourse } = useContext(AlumnosContext);
    const [openGestion, setOpenGestion] = useState(false);
    const [cursoId, setCursoId] = useState(null);

    const features = [
        { name: "Mis Cursos", icon: <AutoStories fontSize="large" />, content: <MisCursos /> },
        { name: "Perfil", icon: <Settings fontSize="large" />, content: <MiPerfil /> },
    ];

    const gestionFeatures = [
        { name: "Eventos", icon: <FolderIcon />, content: <ListaAnunciosEventos isEvento={true} /> },
        { name: "Anuncios", icon: <FolderIcon />, content: <ListaAnunciosEventos isEvento={false} /> },
        { name: "Cursos", icon: <FolderIcon />, content: <ListaCursos /> },
        { name: "Contenido", icon: <FolderIcon />, content: <ComboCursos /> },
    ];

    const findFeatureByName = (name) => {
        return features.find((f) => f.name === name) || gestionFeatures.find((f) => f.name === name);
    };

    const [activeFeature, setActiveFeature] = useState(findFeatureByName("Mis Cursos"));

    useEffect(() => {
        setActiveFeature(findFeatureByName("Mis Cursos"));
        setActiveCourse(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const handleFeatureClick = (feature) => {
        setActiveFeature(feature);
        setActiveCourse(null);
        if (feature.name === "Contenido") {
            setCursoId(null);
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="container-fluid" style={{ paddingTop: "5rem" }}>
            <div className="row" style={{ minHeight: "100vh" }}>
                <div className="col-3" style={{ borderRadius: "1rem", color: "var(--color3)", background: "var(--color5)" }}>
                    <h3 style={{ textAlign: "start", color: "#606468", paddingTop: "2rem" }}>
                        Usuario
                        <p>{User.nombre_completo}</p>
                    </h3>

                    <List>
                        {features.map((feature) => (
                            <ListItem
                                key={feature.name}
                                disablePadding
                                onClick={() => handleFeatureClick(feature)}
                                sx={{
                                    background: activeFeature?.name === feature.name ? "var(--color2)" : "transparent",
                                    transition: "background 0.3s ease",
                                    "&:hover": { background: "var(--color2)", color: "white" },
                                }}
                            >
                                <ListItemButton>
                                    <ListItemIcon>{feature.icon}</ListItemIcon>
                                    <ListItemText primary={feature.name} sx={{ fontSize: "1.5rem" }} />
                                </ListItemButton>
                            </ListItem>
                        ))}

                        {User.rol === "admin" && (
                            <>
                                <Divider />
                                <ListItemButton onClick={() => setOpenGestion(!openGestion)}>
                                    <ListItemIcon>
                                        <Business />
                                    </ListItemIcon>
                                    <ListItemText primary="Gestion" />
                                    {openGestion ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>
                                <Collapse in={openGestion} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {gestionFeatures.map((feature) => (
                                            <ListItemButton
                                                key={feature.name}
                                                onClick={() => handleFeatureClick(feature)}
                                                sx={{
                                                    pl: 4,
                                                    background: activeFeature?.name === feature.name ? "var(--color2)" : "transparent",
                                                    transition: "background 0.3s ease",
                                                    "&:hover": { background: "var(--color2)", color: "white" },
                                                }}
                                            >
                                                <ListItemIcon>{feature.icon}</ListItemIcon>
                                                <ListItemText primary={feature.name} />
                                            </ListItemButton>
                                        ))}
                                    </List>
                                </Collapse>
                            </>
                        )}
                    </List>
                </div>
                <div className="col-9 flex-column" style={{ display: "flex" }}>
                    {activeFeature?.name === "Contenido" && cursoId ? <ListaModulos cursoId={cursoId} /> : activeFeature?.content}
                </div>
            </div>
        </div>
    );
};

export default FeatureGrid;
