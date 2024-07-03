import React from "react";
import "../css/cursosSeccion.css";
import { getAllCursos } from "../controllers/controllerCurso";
import SliderCursosLanding from "./SliderCursosLanding";
// Crear instancias de los modelos Curso

export default class CursosSeccion extends React.Component {
    // Inicializa el estado
    state = {
        cursos: [],
    };

    // Carga los cursos después de montar el componente
    componentDidMount() {
        this.cargarCursos();
    }

    // Método para cargar los cursos
    cargarCursos = async () => {
        try {
            const cursos = await getAllCursos();
            this.setState({ cursos });
        } catch (error) {
            console.error("Error cargando los cursos: ", error);
            // Manejar el error como consideres adecuado
        }
    };
    render() {
        const { cursos } = this.state;
        return (
            <div className="container-fluid background-6 ">
                <div className="container ">
                    <h1 className="cursos-titulo"> Transforma tu futuro Profesional con nuestros cursos ⤵️</h1>
                    {/* <p className="parrafo">
                        Descubre una variedad de cursos especializados para licenciados en enfermería que buscan expandir su expertise y
                        destrezas clínicas. Nuestros programas abarcan desde técnicas avanzadas en cuidados intensivos hasta innovaciones en
                        salud pública, proporcionando una formación integral y actualizada.
                    </p> */}
                    {/* Lista de Cursos */}

                    <SliderCursosLanding cursos={{ cursos }} />
                </div>
            </div>
        );
    }
}
