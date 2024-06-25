/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import "../css/cursoCard.css";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

function CardCurso({ item }) {
    return (
        <Link to={`/inscripcion/${item.id}`} className="">
            <div className="curso-card ">
                <div className="d-flex align-items-center   justify-content-center ">
                    <h3 className=" curso-card-title row   ">{item.title}</h3>
                    <img className="curso-card-img row  " src={item.imageUrl} alt={item.title} />
                </div>
                <div className="curso-card-body">
                    {/* <h4 className="curso-card-price">{Curso.price}</h4> */}
                    <p className="curso-card-author">
                        <strong>Modalidad:</strong> {item.modalidad}
                    </p>
                    <p className="curso-card-duration">
                        <strong>Duración:</strong> {item.duration}
                    </p>
                    <p className="curso-card-start">
                        <strong>Inicio:</strong> {item.start}
                    </p>
                    <p className="curso-card-start">
                        <strong>Carga horaria:</strong> {item.workload}
                    </p>
                    <p className="curso-card-start">
                        <strong>Clases:</strong> {item.classes}
                    </p>
                    <Button className="curso-btn">VER MÁS</Button>
                </div>
            </div>
        </Link>
    );
}

export default CardCurso;
