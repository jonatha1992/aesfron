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
        <motion.div className=" mx-auto   col-lg-6  justify-content-center align-items-center ">
          <h4 className="titulo-nosotros ">¿Quienes somos?</h4>
          <p className="parrafo-nosotros">
            <span className="highlight">Nuestro Objetivo</span> es empoderar a
            los profesionales de la salud, para brindar una atención de calidad,
            basada en evidencia científica.
            <span className="highlight"> La Misión</span> consiste en empoderar
            a enfermeros y profesionales para brindar atención de calidad, a
            través de la capacitación interprofesional fundamentada en el
            respeto de la diversidad cultural. Perseguimos una{" "}
            <span className="highlight">Visión</span> que consiste en
            convertirnos en líderes internacionales en la capacitación y
            fortalecimiento de profesionales de la salud. Inspirándonos en{" "}
            <span className="highlight">Valores fundamentales </span>
            como ética, respeto, integridad, solidaridad, empatía,
            empoderamiento y resiliencia.
          </p>
        </motion.div>
        {/* <div className="col-12 col-lg-6 d-flex justify-content-center align-items-center">
                    <img className="imagen-organizacion  rounded-circle" src={presidenta} alt="" />
                    <label className="text-center" htmlFor="">
                        {" "}
                        Presidenta
                    </label>
                    <label className="text-center" htmlFor="">
                        {" "}
                        Magister
                    </label>
                    <img className="imagen-organizacion rounded-circle" src={vice} alt="" />
                </div> */}

        <div className="nosotros-mobile  ">
          <div className=" ">
            <img
              className="imagen-organizacion mb-2 rounded-circle"
              src={presidenta}
              alt="Presidente Mag. Llanos Beatriz"
            />
            <label className="label-imagen">
              <span className="titulo">Presidente</span>
              <span className="nombre">Mag. Llanos Beatriz</span>
            </label>
          </div>
          <div className=" ">
            <img
              className="imagen-organizacion mb-2 rounded-circle"
              src={vice}
              alt="Vicepresidente Lic. Buenaventura Laura"
            />
            <label className="label-imagen">
              <span className="titulo">Vicepresidente</span>
              <span className="nombre">Lic. Buenaventura Laura</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
