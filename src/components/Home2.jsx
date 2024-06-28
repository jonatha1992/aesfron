// src/Home2.jsx
import React, { useState, useRef, useEffect } from "react";
import "../css/home2.css";
import { Link } from "react-router-dom";
import Nosotros from "../components/Nosotros";
import { motion, useInView, useAnimation } from "framer-motion";
import videoSource from "../assets/video-aepa.mp4";
import imagen_logo from "../assets/logo-removebg.png";
import CursosSeccion from "./CursosSeccion";
import Eventos from "../components/Eventos";

function Home2() {
    const refSection1 = useRef(null);
    const refSection2 = useRef(null);
    const refSection3 = useRef(null);

    const isInViewSection1 = useInView(refSection1, { one: true });
    const isInViewSection2 = useInView(refSection2, { one: true });
    const isInViewSection3 = useInView(refSection3, { one: true });

    const mainControls1 = useAnimation();
    const mainControls2 = useAnimation();
    const mainControls3 = useAnimation();

    useEffect(() => {
        if (isInViewSection1) {
            mainControls1.start("visible");
        }
    }, [isInViewSection1, mainControls1]);

    useEffect(() => {
        if (isInViewSection2) {
            mainControls2.start("visible");
        }
    }, [isInViewSection2, mainControls2]);

    useEffect(() => {
        if (isInViewSection3) {
            mainControls3.start("visible");
        }
    }, [isInViewSection3, mainControls3]);

    return (
        <>
            <section id="seccion1">
                <div className="container-fluid background-1">
                    <div className="container mobile ">
                        <motion.div
                            className="col-md-6 text-start d-flex flex-column flex-column justify-content-center  align-items-center pb-lg-5"
                            variants={{
                                hidden: { opacity: 0, y: 75 },
                                visible: { opacity: 1, u: 0 },
                            }}
                            initial="hidden"
                            animate="visible"
                            transition={{ duration: 0.5, delay: 0.25 }}
                        >
                            <h2 className="titulo-hero">Bienvenidos a AESFRON</h2>
                            <div className="video-container">
                                <video className="video-responsive" src={videoSource} autoPlay loop muted></video>
                            </div>
                            <p className="p-mobile">
                                Priorizamos tu desarrollo profesional para transformar la atención de los cuidados enfermeros
                            </p>
                        </motion.div>
                        <div className="col-md-3"></div>
                    </div>
                </div>
            </section>

            <motion.section
                id="seccion2"
                ref={refSection1}
                variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, u: 0 },
                }}
                initial="hidden"
                animate={mainControls1}
                transition={{ duration: 1, delay: 0.5 }}
            >
                <Nosotros />
            </motion.section>
            <motion.section
                id="seccion3"
                ref={refSection2}
                variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, u: 0 },
                }}
                initial="hidden"
                animate={mainControls2}
                transition={{ duration: 1, delay: 0.5 }}
            >
                <CursosSeccion />
            </motion.section>
            <motion.section
                id="seccion4"
                ref={refSection3}
                variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, u: 0 },
                }}
                initial="hidden"
                animate={mainControls3}
                transition={{ duration: 1, delay: 0.5 }}
            >
                <Eventos />
            </motion.section>
        </>
    );
}

export default Home2;
