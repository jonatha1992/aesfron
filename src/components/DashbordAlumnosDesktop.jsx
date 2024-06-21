import { useAuth } from "../context/AuthContext";
import { AlumnosContext } from "../context/AlumnoContext";
import { Settings, AutoStories } from "@mui/icons-material";
import MisCursos from "../components/MisCursos";
import { useState, useContext } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import MiPerfil from "./MiPerfil";
import Divider from "@mui/material/Divider";
import AltaCurso from "./AltaCursos";
import AltaAnuncios from "./AltaAnuncios";
import AltaEventos from "./AltaEventos";
import ModificacionAnuncios from "./ModificacionAnuncios";
import ModificacionEventos from "./ModificacionEventos";
import BajaAnuncios from "./BajaAnuncios";
import BajaEventos from "./BajaEventos";

const AltaCursos = () => {
  return (
    <div>
      <h2>Alta de Cursos</h2>
      <AltaCurso />
    </div>
  );
};

const BajaCursos = () => {
  return (
    <div>
      <h2>Baja de Cursos</h2>
      {/* Agrega tu formulario o funcionalidad aquí */}
    </div>
  );
};

const ModificacionCursos = () => {
  return (
    <div>
      <h2>Modificación de Cursos</h2>
      {/* Agrega tu formulario o funcionalidad aquí */}
    </div>
  );
};

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
      name: "Anuncios",
      icon: <InboxIcon />,
      route: "/alta/anuncios",
      content: <AltaAnuncios />,
    },
    {
      name: "Eventos",
      icon: <InboxIcon />,
      route: "/alta/eventos",
      content: <AltaEventos />,
    },
    {
      name: "Cursos",
      icon: <InboxIcon />,
      route: "/modificacion/cursos",
      content: <ModificacionCursos />,
    },
    {
      name: "Anuncios",
      icon: <InboxIcon />,
      route: "/modificacion/anuncios",
      content: <ModificacionAnuncios />,
    },
    {
      name: "Eventos",
      icon: <InboxIcon />,
      route: "/modificacion/eventos",
      content: <ModificacionEventos />,
    },
    {
      name: "Cursos",
      icon: <InboxIcon />,
      route: "/baja/cursos",
      content: <BajaCursos />,
    },
    {
      name: "Anuncios",
      icon: <InboxIcon />,
      route: "/baja/anuncios",
      content: <BajaAnuncios />,
    },
    {
      name: "Eventos",
      icon: <InboxIcon />,
      route: "/baja/eventos",
      content: <BajaEventos />,
    },
  ];

  const isAdmin = User.rol === "admin";

  const [activeFeature, setActiveFeature] = useState(features[0]);
  const [openCollapse, setOpenCollapse] = useState({});

  const handleFeatureClick = (feature) => {
    setActiveFeature(feature);
    setActiveCourse(null);
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
                  background:
                    activeFeature.name === feature.name
                      ? "var(--color2)"
                      : "transparent",
                  transition: "background 0.3s ease",
                  "&:hover": {
                    background: "var(--color2)",
                    color: "white",
                  },
                }}
              >
                <ListItemButton>
                  <ListItemIcon>{feature.icon}</ListItemIcon>
                  <ListItemText
                    primary={feature.name}
                    sx={{ fontSize: "1.5rem" }}
                  />
                </ListItemButton>
              </ListItem>
            ))}

            {isAdmin && (
              <>
                <Divider />
                {["ALTA", "MODIFICACION", "BAJA"].map((section) => (
                  <div key={section}>
                    <ListItemButton onClick={() => handleClick(section)}>
                      <ListItemIcon>
                        <InboxIcon />
                      </ListItemIcon>
                      <ListItemText primary={section} />
                      {openCollapse[section] ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse
                      in={openCollapse[section]}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        {features
                          .filter((feature) =>
                            feature.route.startsWith(
                              `/${section.toLowerCase()}`
                            )
                          )
                          .map((feature, index) => (
                            <ListItemButton
                              key={index}
                              onClick={() => handleFeatureClick(feature)}
                              sx={{
                                pl: 4,
                                background:
                                  activeFeature.name === feature.name
                                    ? "var(--color2)"
                                    : "transparent",
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
          {activeFeature ? activeFeature.content : null}
        </div>
      </div>
    </div>
  );
};

export default FeatureGrid;
