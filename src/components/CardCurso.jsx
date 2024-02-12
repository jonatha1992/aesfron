import React from "react";
import PropTypes from "prop-types";
import "../css/cursoCard.css";
import { Link } from "react-router-dom";

function CardCurso({ Curso }) {
    console.log(Curso);
    return (
        <div className="curso-card">
            <img className="curso-card-img" src={Curso.imageUrl} alt={Curso.title} />
            <div className="curso-card-body">
                <h3 className="curso-card-title">{Curso.title}</h3>
                <h4 className="curso-card-price">{Curso.price}</h4>
                <p className="curso-card-author">
                    <strong>Autor:</strong> {Curso.author}
                </p>
                <p className="curso-card-duration">
                    <strong>Duración:</strong> {Curso.duration}
                </p>
                <p className="curso-card-start">
                    <strong>Inicio:</strong> {Curso.start}
                </p>
                <p className="curso-card-start">
                    <strong>Carga horaria:</strong> {Curso.Workload}
                </p>
                <p className="curso-card-start">
                    <strong>Dias de Clases:</strong> {Curso.classes}
                </p>
                <Link to="/inscripcion/poxSpo7snZxVQqEEemL4" className="curso-btn">
                    VER MÁS
                </Link>
            </div>
        </div>
    );
}

CardCurso.propTypes = {
    Curso: PropTypes.shape({
        title: PropTypes.string.isRequired,
        imageUrl: PropTypes.string,
        author: PropTypes.string,
        price: PropTypes.string,
        duration: PropTypes.string,
        start: PropTypes.string,
        Workload: PropTypes.string,
        classes: PropTypes.string,
    }).isRequired,
};

export default CardCurso;
