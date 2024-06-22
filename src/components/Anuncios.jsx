import React from "react";
import "../css/eventos.css";
import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa"; // Importng all icons for simplicity
import { FiMail } from "react-icons/fi"; //
import imagen2 from "../assets/enfermera-que-cuida-de-un-hombre-mayor-en-casa.webp";

const divStyle = {
  backgroundPosition: "center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  height: "10rem", // Ajusta la altura según sea necesario
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  color: "#ffffff", // Cambia el color del texto según sea necesario
  textAlign: "center",
  flexDirection: "column",
};
export default function Anuncios() {
  return (
    <div>
      <div className="card-evento-anuncio">
        <div
          className="card-event-image"
          style={{ ...divStyle, backgroundImage: `url(${imagen2})` }}
        >
          <h3 className="card-evento-titulo">Próximamente Talleres y Cursos</h3>
          <div className="d-flex justify-content-end" style={{ width: "100%" }}>
            <p className="card-evento-fecha">Segundo Semestre</p>
          </div>
        </div>
        <div
          className="d-flex flex-column justify-content-around"
          style={{ flexGrow: "1", textAlign: "center", maxHeight: "60%" }}
        >
          <ul className="list-unstyled">
            <li>Oxigeno Terapia</li>
            <li>Cuidados de Ostomía</li>
            <li>Cuidados de Heridas</li>
            <li>Incumbencias Legales en Enfermería</li>
            <li>Registros de Enfermería</li>
            <li>Cuidados Domiciliarios Adulto Mayor</li>
            <li>Cuidados Domiciliarios Pediátricos</li>
          </ul>
        </div>
        <div className="d-flex justify-content-center flex-row pt-4">
          <a
            href="https://www.facebook.com/profile.php?id=61551020911888"
            style={{ color: "#516269" }}
          >
            <FaWhatsapp size={25} className="me-3 " />
          </a>
          <a href="mailto:secretaria@aepa.com.ar">
            <FiMail size={25} className="me-3 " style={{ color: "#516269" }} />
          </a>
          <a href="https://www.facebook.com/profile.php?id=61551020911888">
            <FaFacebook
              size={25}
              className="me-3 "
              style={{ color: "#516269" }}
            />
          </a>
          <a href="https://www.instagram.com/aepa318/">
            <FaInstagram
              size={25}
              className="me-3 "
              style={{ color: "#516269" }}
            />
          </a>
          <a className=" fw-bold me-3" href="https://www.tiktok.com/@aepa2523">
            <svg
              xmlns="http://www.w3.org/2500/svg"
              width="25"
              height="25"
              fill="currentColor"
              className="bi bi-tiktok   "
              style={{ color: "#516269" }}
              viewBox="0 0 16 16"
            >
              <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
