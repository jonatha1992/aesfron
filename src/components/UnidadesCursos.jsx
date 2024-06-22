import { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import LinkIcon from "@mui/icons-material/Link";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import InfoIcon from "@mui/icons-material/Info";
import { getModulos } from "../controllers/controllerCurso";

const iconStyle = {
    width: "1.5em",
    height: "1.5em",
    marginRight: "5px",
};

const containerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
};

const headerStyle = {
    color: "#606468",
};

const accordionSummaryStyle = {
    background: "var(--color6)",
    color: "white",
    fontSize: "1.5rem",
    marginBottom: "5px",
    borderRadius: "5px",
    padding: "5px",
    cursor: "pointer",
};

const accordionDetailsStyle = {
    backgroundColor: "rgb(182 199 213)",
    paddingBottom: "0.5rem",
    borderRadius: "5px",
};

const getIcon = (tipo) => {
    switch (tipo) {
        case "pdf":
            return <PictureAsPdfIcon style={iconStyle} />;
        case "link":
            return <LinkIcon style={iconStyle} />;
        case "Info":
            return <InfoIcon style={iconStyle} />;
        default:
            return null;
    }
};

const MaterialItem = ({ item, onClick }) => (
    <div className="titulo-contenido" onClick={() => onClick(item.url)} style={{ cursor: "pointer" }}>
        <div className="d-flex flex-row align-items-center" style={{ width: "100%" }}>
            {getIcon(item.tipo)}
            <Typography>{item.titulo}</Typography>
            {item.tipo !== "link" && item.tipo !== "Info" && <DownloadForOfflineIcon style={{ marginLeft: "auto" }} />}
        </div>
    </div>
);

const UnidadAccordion = ({ unidad, handleMaterialClick }) => (
    <Accordion key={unidad.id} defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} style={accordionSummaryStyle}>
            {unidad.titulo}
        </AccordionSummary>
        <AccordionDetails style={accordionDetailsStyle}>
            {unidad.items.map((item) => (
                <MaterialItem key={item.id} item={item} onClick={handleMaterialClick} />
            ))}
        </AccordionDetails>
    </Accordion>
);

const UnidadesCursos = ({ activeCourse }) => {
    const { id, title, mail } = activeCourse || {};
    const [contenido, setContenido] = useState([]);

    useEffect(() => {
        const fetchDataFromFirebase = async () => {
            try {
                const contenidoData = await getModulos(id);
                setContenido(contenidoData);
            } catch (error) {
                console.error("Error al obtener datos de Firebase:", error);
                // Aquí podrías agregar lógica para mostrar un mensaje de error al usuario
            }
        };

        if (id) {
            fetchDataFromFirebase();
        }
    }, [id]);

    const handleMaterialClick = (datourl) => {
        window.open(datourl, "_blank");
    };

    return (
        <div className="container flex-wrap">
            <div style={containerStyle}>
                <div className="col-5">
                    <label className="text-capitalize fw-bold text-uppercase fs-5">Profesores</label>
                    <Typography variant="h6" className="text-capitalize p-1  mb-1 rounded   " style={headerStyle}>
                        <span className="fw-bold text-uppercase">Curso: </span> {title}
                    </Typography>
                    <Typography variant="h6" className="text-lowercase p-1 mb-2 rounded  " style={headerStyle}>
                        <span className="fw-bold text-uppercase">Mail: </span> {mail}
                    </Typography>
                </div>

                <div className="col-6 " style={{ color: "black", background: "#5d809d" }}>
                    {contenido.map((unidad) => (
                        <UnidadAccordion key={unidad.id} unidad={unidad} handleMaterialClick={handleMaterialClick} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UnidadesCursos;
