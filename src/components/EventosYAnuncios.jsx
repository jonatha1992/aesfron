import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "../css/eventos.css";
import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import { obtenerRecientes } from "../firebase";

const EventosYAnuncios = () => {
    const [eventos, setEventos] = useState([]);
    const [anuncios, setAnuncios] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const eventosObtenidos = await obtenerRecientes(5, "eventos");
                setEventos(eventosObtenidos);
                const anunciosObtenidos = await obtenerRecientes(5, "anuncios");
                setAnuncios(anunciosObtenidos);
            } catch (error) {
                console.error("Error al obtener datos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div>Cargando...</div>;
    }

    const hayEventos = eventos && eventos.length > 0;
    const hayAnuncios = anuncios && anuncios.length > 0;

    if (!hayEventos && !hayAnuncios) {
        return (
            <div className="container p-5 text-center">
                {" "}
                <h1 className="titulo-evento-anuncio">No hay eventos ni anuncios disponibles al momento.</h1>
            </div>
        );
    }

    const soloUno = (hayEventos && !hayAnuncios) || (!hayEventos && hayAnuncios);

    return (
        <div className="container p-5">
            <div className={`row pt-5 ${soloUno ? "justify-content-center" : ""}`}>
                {hayEventos && (
                    <div className={`col-12 ${soloUno ? "col-md-8" : "col-md-6"} mb-4`}>
                        <div className="evento-encabezado">
                            <h1 className="titulo-evento-anuncio mt-0">EVENTOS</h1>
                        </div>
                        <EventosSlider eventos={eventos} />
                    </div>
                )}
                {hayAnuncios && (
                    <div className={`col-12 ${soloUno ? "col-md-6" : "col-md-6"} mb-4`}>
                        <div className="evento-encabezado">
                            <h1 className="titulo-evento-anuncio mt-0">ANUNCIOS</h1>
                        </div>
                        <AnunciosSlider anuncios={anuncios} />
                    </div>
                )}
            </div>
        </div>
    );
};
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

const Card = ({ titulo, subtitulo, imagen, descripcion, fondoStyle }) => (
    <div className="card-evento-anuncio mb-4">
        <div className="card-event-image" style={{ ...fondoStyle, backgroundImage: `url(${imagen})` }}>
            <h3 className="card-evento-titulo">{titulo}</h3>
            <div className="d-flex justify-content-end" style={{ width: "100%" }}></div>
        </div>
        <div className="d-flex flex-column justify-content-around" style={{ flexGrow: "1", textAlign: "center", height: "60%" }}>
            <div className="body-card-seccionanuncios">
                <p className="card-evento-subtitulo">{subtitulo}</p>
                <p className="card-evento-descripcion">{descripcion}</p>
            </div>
        </div>
        <div className="d-flex justify-content-center flex-row pt-4">
            <a href="https://www.facebook.com/profile.php?id=61551020911888" style={{ color: "#516269" }}>
                <FaWhatsapp size={25} className="me-3" />
            </a>
            <a href="mailto:secretaria@aepa.com.ar">
                <FiMail size={25} className="me-3" style={{ color: "#516269" }} />
            </a>
            <a href="https://www.facebook.com/profile.php?id=61551020911888">
                <FaFacebook size={25} className="me-3" style={{ color: "#516269" }} />
            </a>
            <a href="https://www.instagram.com/aepa318/">
                <FaInstagram size={25} className="me-3" style={{ color: "#516269" }} />
            </a>
            <a className="fw-bold me-3" href="https://www.tiktok.com/@aepa2523">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    fill="currentColor"
                    className="bi bi-tiktok"
                    style={{ color: "#516269" }}
                    viewBox="0 0 16 16"
                >
                    <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
                </svg>
            </a>
        </div>
    </div>
);

const EventosSlider = ({ eventos }) => {
    const settings = {
        arrows: false,
        dots: false,
        autoplay: eventos?.length > 1,
        infinite: eventos?.length > 1,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: eventos?.length > 1,
                    dots: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 1,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    const defaultImageURL = "https://www.uba.ar/imgs/w-HOSPITALES-1920x980.jpg";

    if (!eventos || eventos.length === 0) {
        return <div>No hay eventos disponibles.</div>;
    }

    return (
        <Slider {...settings} className="px-lg-5">
            {eventos.map((evento) => (
                <Card
                    key={evento.id}
                    titulo={evento.TITULO}
                    subtitulo={evento.SUBTITULO}
                    imagen={evento.IMAGEN || defaultImageURL}
                    descripcion={evento.DESCRIPCION}
                    fondoStyle={divStyle}
                />
            ))}
        </Slider>
    );
};

const AnunciosSlider = ({ anuncios }) => {
    const settings = {
        arrows: false,
        dots: false,
        autoplay: anuncios?.length > 1,
        infinite: anuncios?.length > 1,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: anuncios?.length > 1,
                    dots: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 1,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    const defaultImageURL = "https://www.uba.ar/imgs/w-HOSPITALES-1920x980.jpg";

    if (!anuncios || anuncios.length === 0) {
        return <div>No hay anuncios disponibles.</div>;
    }

    return (
        <Slider {...settings} className="px-lg-5">
            {anuncios.map((anuncio) => (
                <Card
                    key={anuncio.id}
                    titulo={anuncio.TITULO}
                    subtitulo={anuncio.SUBTITULO}
                    imagen={anuncio.IMAGEN || defaultImageURL}
                    descripcion={anuncio.DESCRIPCION}
                    fondoStyle={divStyle}
                />
            ))}
        </Slider>
    );
};

export default EventosYAnuncios;
