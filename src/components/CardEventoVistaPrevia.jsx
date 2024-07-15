import React from "react";
import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa";
import { FiMail } from "react-icons/fi";

const CardEventoVistaPrevia = ({ titulo, subTitulo, descripcion, imagen }) => {
    const divStyle = {
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        height: "200px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "#ffffff",
        textAlign: "center",
        flexDirection: "column",
    };

    return (
        <div className="col-4 card-evento-anuncio  mt-5 mx-5" style={{ height: "70vh" }}>
            <div className="card-event-image" style={{ ...divStyle, backgroundImage: `url(${imagen})` }}>
                <h3 className="card-evento-titulo">{titulo}</h3>
                <div className="d-flex justify-content-end" style={{ width: "100%" }}></div>
            </div>
            <div className="d-flex flex-column justify-content-around" style={{ flexGrow: "1", textAlign: "center", height: "60%" }}>
                <div className="body-card-seccionanuncios">
                    <p className="card-evento-subtitulo">{subTitulo}</p>
                    <p className="card-evento-descripcion">{descripcion}</p>
                </div>
            </div>
            <div className="d-flex justify-content-center flex-row pt-4">
                <a style={{ color: "#516269" }}>
                    <FaWhatsapp size={25} className="me-3" />
                </a>
                <a style={{ color: "#516269" }}>
                    <FiMail size={25} className="me-3" />
                </a>
                <a style={{ color: "#516269" }}>
                    <FaFacebook size={25} className="me-3" />
                </a>
                <a style={{ color: "#516269" }}>
                    <FaInstagram size={25} className="me-3" />
                </a>
                <a style={{ color: "#516269" }}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="25"
                        fill="currentColor"
                        className="bi bi-tiktok"
                        viewBox="0 0 16 16"
                    >
                        <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
                    </svg>
                </a>
            </div>
        </div>
    );
};

export default CardEventoVistaPrevia;
