import { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import LinkIcon from "@mui/icons-material/Link";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import { getModulos } from "../controllers/controllerCurso";

const UnidadesCursos = ({ activeCourse }) => {
    const { id, title, mail } = activeCourse || {};
    console.log("activeCourse", activeCourse);
    const [contenido, setContenido] = useState([]);

    useEffect(() => {
        const fetchDataFromFirebase = async () => {
            try {
                const contenidoData = await getModulos(id);
                setContenido(contenidoData);
            } catch (error) {
                console.error("Error al obtener datos de Firebase:", error);
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
        <div className="container ">
            <div
                className=""
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                }}
            >
                <div className="d-flex bg-white justify-content-center flex-wrap ">
                    <Typography
                        variant="h6"
                        className=" text-capitalize p-2 mb-3 rounded col-lg-6 col-12   "
                        style={{ color: "#606468" }}
                    >
                        <span className="fw-bold text-uppercase">Curso: </span> {title}
                    </Typography>
                    <Typography
                        variant="h6"
                        className=" text-lowercase p-2 mb-3 rounded col-lg-5 col-12"
                        style={{ color: "#606468" }}
                    >
                        <span className="fw-bold text-uppercase">Mail: </span> {mail}
                    </Typography>
                </div>

                <div style={{ color: "black", background: "#5d809d" }}>
                    {contenido.map((unidad) => (
                        <Accordion key={unidad.id} defaultExpanded>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                style={{
                                    background: "var(--color6)",
                                    color: "white",
                                    fontSize: "1.5rem",
                                    marginBottom: "5px",
                                    borderRadius: "5px",
                                    padding: "5px",
                                    cursor: "pointer",
                                }}
                            >
                                {unidad.titulo}
                            </AccordionSummary>
                            <AccordionDetails
                                style={{
                                    backgroundColor: "rgb(182 199 213)",
                                    paddingBottom: "0.5rem",
                                    borderRadius: "5px",
                                }}
                            >
                                {unidad.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="titulo-contenido "
                                        onClick={() => handleMaterialClick(item.url)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <div className="d-flex flex-row align-items-center" style={{ width: "100%" }}>
                                            {item.tipo === "pdf" && (
                                                <PictureAsPdfIcon
                                                    style={{
                                                        width: "1.5em",
                                                        height: "1.5em",
                                                        marginRight: "5px",
                                                    }}
                                                />
                                            )}
                                            <Typography>{item.titulo}</Typography>
                                            {item.tipo === "link" && (
                                                <LinkIcon
                                                    style={{
                                                        width: "1.5em",
                                                        height: "1.5em",
                                                        marginRight: "5px",
                                                    }}
                                                />
                                            )}
                                            {item.tipo === "Info" && (
                                                <LinkIcon
                                                    style={{
                                                        width: "1.5em",
                                                        height: "1.5em",
                                                        marginRight: "5px",
                                                    }}
                                                />
                                            )}
                                            <DownloadForOfflineIcon />
                                        </div>
                                    </div>
                                ))}
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UnidadesCursos;
