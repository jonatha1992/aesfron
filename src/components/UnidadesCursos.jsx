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
import FolderIcon from "@mui/icons-material/Folder";
import { Backdrop, CircularProgress } from "@mui/material";

const iconStyle = {
    width: "1.5rem",
    height: "1.5rem",
    marginRight: "5px",
};

const headerStyle = {
    color: "#606468",
};

const accordionTitleStyle = {
    backgroundColor: "rgb(225 239 239)",
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

const MaterialItem = ({ item }) => {
    const isClickable = item.tipo !== "Info";

    const handleClick = (e, url) => {
        if (item.tipo === "link") {
            window.open(item.url, "_blank");
        }
    };
    const handleDownloadClick = (e, url) => {
        const fileUrl = url; // Cambia esto por la URL de tu archivo
        const link = document.createElement("a");
        link.target = "_blank";
        link.href = fileUrl;
        link.download = "file.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div
            className={` ${isClickable ? "" : "non-clickable"}`}
            onClick={isClickable ? handleClick : null}
            style={itemStyle}
            onMouseEnter={isClickable ? (e) => (e.currentTarget.style.backgroundColor = itemHoverStyle.backgroundColor) : null}
            onMouseLeave={isClickable ? (e) => (e.currentTarget.style.backgroundColor = itemStyle.background) : null}
        >
            <div className="d-flex flex-row align-items-center w-100">
                {getIcon(item.tipo)}
                <Typography style={textStyle}>{item.titulo}</Typography>
                {item.tipo !== "link" && item.tipo !== "Info" && (
                    <DownloadForOfflineIcon
                        style={{ marginLeft: "auto", cursor: "pointer" }}
                        onClick={(e) => handleDownloadClick(e, item.url)}
                    />
                )}
            </div>
        </div>
    );
};

const UnidadAccordion = ({ unidad }) => (
    <Accordion key={unidad.id}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} style={accordionItemSummaryStyle}>
            <FolderIcon style={{ width: "1.5rem", height: "1.5rem", marginRight: "5px" }} /> {unidad.titulo}
        </AccordionSummary>
        <AccordionDetails style={accordionDetailsStyle}>
            {unidad.items.map((item) => (
                <MaterialItem key={item.id} item={item} />
            ))}
        </AccordionDetails>
    </Accordion>
);

const InfoCursosAccordion = ({ detalles }) => {
    return (
        <>
            <Accordion className="mb-3" defaultExpanded style={headerStyle}>
                <AccordionSummary className=" border-bottom border-2 " style={accordionTitleStyle} expandIcon={<ExpandMoreIcon />}>
                    <InfoIcon style={iconStyle} />
                    <label className="text-capitalize fw-bold fs-5 w-100 text-start mb-0   ">Información</label>
                </AccordionSummary>
                <AccordionDetails className="text-start mb-1">
                    <Typography className="fw-bold text-uppercase">Curso</Typography>
                    <Typography className="text-capitalize mb-2">{detalles.title}</Typography>

                    <Typography className="fw-bold text-uppercase">Clases</Typography>
                    <Typography className="text-capitalize mb-2">{detalles.classes}</Typography>

                    <Typography className="fw-bold text-uppercase">Link / Lugar de Reunión</Typography>
                    <Typography className="text-capitalize mb-2">{"meet"}</Typography>

                    <Typography className="fw-bold text-uppercase">Mail</Typography>
                    <Typography className="text-lowercase">{detalles.mail}</Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded style={headerStyle}>
                <AccordionSummary className=" border-bottom border-2 " style={accordionTitleStyle} expandIcon={<ExpandMoreIcon />}>
                    <InfoIcon style={iconStyle} />
                    <label className="text-capitalize fw-bold fs-5 w-100 text-start mb-0  ">Profesores</label>
                </AccordionSummary>
                <AccordionDetails className="text-start mb-1 ">
                    <Typography className="fw-bold text-uppercase">Coordinación</Typography>
                    <Typography className="text-capitalize mb-2">{detalles.coordinacion}</Typography>
                    <Typography className="fw-bold text-uppercase">Docentes</Typography>
                    {detalles.disertantes.map((disertante, index) => (
                        <Typography key={index} className="text-capitalize mb-2">
                            <li>{disertante}</li>
                        </Typography>
                    ))}
                </AccordionDetails>
            </Accordion>
        </>
    );
};

const UnidadesCursos = ({ activeCourse }) => {
    const { cursoid, detalles } = activeCourse || {};
    const [loading, setLoading] = useState(true); // Estado para controlar la carga inicial
    const [contenido, setContenido] = useState([]);

    useEffect(() => {
        const fetchDataFromFirebase = async () => {
            setLoading(true); // Mover esto aquí para empezar la carga
            try {
                const contenidoData = await getModulos(cursoid);
                setContenido(contenidoData);
            } catch (error) {
                console.error("Error al obtener datos de Firebase:", error);
            } finally {
                setLoading(false); // Mover esto aquí para finalizar la carga
            }
        };
        if (cursoid) {
            fetchDataFromFirebase();
        } else {
            setLoading(false); // Asegurarse de que el loading se detenga si no hay cursoid
        }
    }, [cursoid]);
    return (
        <>
            <Backdrop open={loading} style={{ zIndex: 9999 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className="container d-flex flex-column flex-md-row flex-wrap">
                <div className="col-12 col-lg-4 p-1 rounded mb-2">
                    <InfoCursosAccordion detalles={detalles} />
                </div>
                <div className="mx-auto col-12 col-lg-7">
                    {contenido.map((unidad) => (
                        <UnidadAccordion key={unidad.id} unidad={unidad} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default UnidadesCursos;
