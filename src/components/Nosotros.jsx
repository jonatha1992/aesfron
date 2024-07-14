import React from "react";
import presidenta from "../assets/presidenta.jpg";
import vice from "../assets/vice.jpg";
import "../css/nosotros.css";
import { motion } from "framer-motion";
import videoSource from "../assets/video-aepa.mp4";
export default function Nosotros() {
    return (
        <div className="container-fluid background-7 p-sm-0 p-lg-5 ">
            <div className=" d-flex justify-content-between  mt-5 flex-wrap align-items-center align-content-center">
                <motion.div className=" mx-auto  col-lg-5  justify-content-center align-items-center ">
                    <h4 className="titulo-nosotros ">Nosotros</h4>
                    <ul class="list-unstyled parrafo-nosotros">
                        <li class="mb-1">
                            <strong class="d-block text-uppercase">PRESIDENTE</strong>
                            <span class="d-block">Prof. Lic. Llanos Beatriz.</span>
                        </li>
                        <li class="mb-2">
                            <strong class="d-block text-uppercase">VICEPRESIDENTE</strong>
                            <span class="d-block">Prof. Lic. Buenaventura Laura.</span>
                        </li>
                        <li class="mb-2">
                            <strong class="d-block text-uppercase">SECRETARIO</strong>
                            <span class="d-block">Prof. Lic. Chirino Claudia.</span>
                        </li>
                        <li class="mb-2">
                            <strong class="d-block text-uppercase">SECRETARIA DE INVESTIGACIÓN Y PROYECTO</strong>
                            <span class="d-block">Lic. Esp. en Neonatología. Lic. en Educ. y Com. Chiolo Hernán.</span>
                        </li>
                        <li class="mb-2">
                            <strong class="d-block text-uppercase">SECRETARIA DE RELACIONES INTERHOSPITALARIAS</strong>
                            <span class="d-block">Lic. en Enf. Clr. Esp. en Desarrollo Personal. Torres María.</span>
                        </li>
                        <li class="mb-2">
                            <strong class="d-block text-uppercase">SECRETARIA LEGAL</strong>
                            <span class="d-block">Dra. Nervi Marcela.</span>
                        </li>
                        <li class="mb-2">
                            <strong class="d-block text-uppercase">SECRETARIA DE ACCIÓN SOCIAL</strong>
                            <span class="d-block">Lic. en Enf. Inst. en Emerg. y Catást. González Elizabeth.</span>
                        </li>
                        <li class="mb-2">
                            <strong class="d-block text-uppercase">SECRETARIA DE DOCENCIA</strong>
                            <span class="d-block">Prof. Lic. Luna Susana.</span>
                            <ul class="list-unstyled mt-2 ml-3">
                                <li class="mb-2">
                                    <strong class="d-block text-uppercase">COORDINACIÓN VIRTUAL</strong>
                                    <span class="d-block">Prof. Lic. en Enf. Esp. en Emerg. Percara Hernán.</span>
                                </li>
                                <li class="mb-2">
                                    <strong class="d-block text-uppercase">COORDINACIÓN PRESENCIAL</strong>
                                    <span class="d-block">Prof. Mag. Barrientos Verónica.</span>
                                </li>
                            </ul>
                        </li>
                        <li class="mb-3">
                            <strong class="d-block text-uppercase">SECRETARIA DE PRENSA Y COMUNICACIÓN</strong>
                            <span class="d-block">Growth Marketing Digital. Barnetch Nicolás.</span>
                        </li>
                    </ul>
                </motion.div>
                <div className="nosotros-mobile  ">
                    <div className=" nosotros-container-org">
                        <img className="imagen-organizacion mb-2 rounded-circle" src={presidenta} alt="Presidente Mag. Llanos Beatriz" />
                        <label className="label-imagen">
                            <span className="titulo">Presidente</span>
                            <span className="nombre">Prof. Lic. Llanos Beatriz</span>
                        </label>
                    </div>
                    <div className=" nosotros-container-org">
                        <img className="imagen-organizacion  mb-2 rounded-circle" src={vice} alt="Vicepresidente Lic. Buenaventura Laura" />
                        <label className="label-imagen">
                            <span className="titulo">Vicepresidente</span>
                            <span className="nombre">Prof. Lic. Buenaventura Laura</span>
                        </label>
                    </div>
                </div>

                <motion.div className=" mx-auto  col-lg-6 mt-5  ">
                    <p className="parrafo-nosotros-vision ">
                        <span className="highlight">Nuestro Enfoque</span> es empoderar a los profesionales de la salud para brindar una
                        atención de calidad, innovadora y basada en la evidencia científica. Nuestra{" "}
                        <span className="highlight">Misión</span> es capacitar a enfermeros y otros profesionales de la salud, fomentando el
                        respeto a la diversidad cultural, con el objetivo de transformar la experiencia del paciente. Con una{" "}
                        <span className="highlight">Visión</span> en convertirnos en líderes internacionales en el fortalecimiento de los
                        profesionales sanitarios, impulsando la continua mejora de los servicios de salud. Inspirados en{" "}
                        <spam className="highlight">Valores</spam> como la ética, integridad, solidaridad, empatía y resiliencia, estamos
                        comprometidos a brindar un servicio de excelencia y generar un impacto transformador en la salud y el bienestar de
                        las comunidades a las que servimos.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
