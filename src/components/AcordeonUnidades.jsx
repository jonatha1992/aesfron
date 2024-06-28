import React, { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import FolderIcon from "@mui/icons-material/Folder";

import { getModulos } from "../controllers/controllerCurso";

const iconStyle = {
    width: "1.5rem",
    height: "1.5rem",
    marginRight: "5px",
};

const accordionItemSummaryStyle = {
    background: "var(--color6)", // Gradiente de azul oscuro a azul claro
    color: "white",
    textTransform: "uppercase",
    fontSize: "1.2rem",
    marginBottom: "2px",
    borderRadius: "5px",
    padding: "0.2rem 0.5rem",
    cursor: "pointer",
};

const accordionDetailsStyle = {
    backgroundColor: "#f4f4f4", // Gris claro
    paddingBottom: "0.2rem",
    borderRadius: "5px",
};

const itemStyle = {
    border: "2px solid rgb(255, 255, 255)",
    padding: "0.5rem",
    display: "flex",
    fontSize: "1rem",
    justifyContent: "space-between",
    background: "#deefef",
    transition: "background-color 0.3s",
};

const itemHoverStyle = {
    backgroundColor: "#cececf", // Gris un poco más oscuro al pasar el ratón
};

const textStyle = {
    textAlign: "start",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    color: "#606468",
    fontSize: "1rem",
};

const UnidadAccordion = ({ unidad }) => (
    <Accordion key={unidad.id} className="w-100">
        <AccordionSummary expandIcon={<ExpandMoreIcon />} style={accordionItemSummaryStyle}>
            <FolderIcon style={iconStyle} />
            <Typography>{unidad.titulo}</Typography>
        </AccordionSummary>
        <AccordionDetails style={accordionDetailsStyle}>
            <List>
                {unidad.items.map((item) => (
                    <ListItem
                        key={item.id}
                        style={itemStyle}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = itemHoverStyle.backgroundColor)}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = itemStyle.background)}
                    >
                        <Typography style={textStyle}>{item.titulo}</Typography>
                    </ListItem>
                ))}
            </List>
        </AccordionDetails>
    </Accordion>
);

export default function AcordeonUnidades({ cursoid }) {
    const [unidades, setUnidades] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUnidades = async () => {
            setLoading(true);
            try {
                const unidadesData = await getModulos(cursoid);
                setUnidades(unidadesData);
            } catch (error) {
                console.error("Error al obtener las unidades:", error);
            } finally {
                setLoading(false);
            }
        };

        if (cursoid) {
            fetchUnidades();
        } else {
            setLoading(false);
        }
    }, [cursoid]);

    if (loading) {
        return (
            <Backdrop open={loading} style={{ zIndex: 9999 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
        );
    }

    return (
        <div className="container-modulos  ">
            {unidades.map((unidad) => (
                <UnidadAccordion key={unidad.id} unidad={unidad} />
            ))}
        </div>
    );
}
