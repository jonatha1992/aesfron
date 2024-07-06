// import { useAuth } from "../context/AuthContext";
// import React from "react";
// import "../css/dashbordAlumnos.css"; // Actualiza la referencia al nuevo archivo CSS
// import { Home, Settings, Mail, Search, AutoStories } from "@mui/icons-material";
// import { Link } from "react-router-dom";
// import Typography from "@mui/material/Typography";
// import Breadcrumbs from "@mui/material/Breadcrumbs";

// const FeatureGrid = () => {
//     const { User } = useAuth();
//     const features = [
//         {
//             name: "Mis Cursos",
//             icon: <AutoStories fontSize="large" />,
//             route: "/miscursos",
//         },
//         { name: "Perfil", icon: <Settings fontSize="large" />, route: "/perfil" },
//         {
//             name: "Notificaciones",
//             icon: <Mail fontSize="large" />,
//             route: "/cursos",
//         },
//         { name: "Home", icon: <Home fontSize="large" />, route: "/cursos" },
//         // ... Agrega más funcionalidades según sea necesario
//     ];

//     return (
//         <>
//             <div className="container" style={{ paddingTop: "10rem" }}>
//                 <h3 style={{ textAlign: "start", color: "#606468" }}>Bienvenido {User.nombre_completo}.</h3>

//                 <div className="feature-grid">
//                     {features.map((feature, index) => (
//                         <Link to={feature.route} key={index}>
//                             <div className="feature-item">
//                                 {feature.icon}
//                                 <span>{feature.name}</span>
//                             </div>
//                         </Link>
//                     ))}
//                 </div>
//             </div>
//         </>
//     );
// };

// export default FeatureGrid;

import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { AutoStories, Home, Mail, Settings, Business } from "@mui/icons-material"; // Importa el nuevo ícono para el feature de administrador

import "../css/dashbordAlumnos.css";

const FeatureGrid = () => {
    const { User } = useAuth();

    const isAdmin = User.rol === "admin"; // Verifica si el usuario es administrador

    // Define los features comunes para todos los usuarios
    const features = [
        {
            name: "Mis Cursos",
            icon: <AutoStories fontSize="large" />,
            route: "/miscursos",
        },
        { name: "Perfil", icon: <Settings fontSize="large" />, route: "/perfil" },
        // {
        //   name: "Notificaciones",
        //   icon: <Mail fontSize="large" />,
        //   route: "/notificaciones",
        // },
        { name: "Home", icon: <Home fontSize="large" />, route: "/" },
    ];

    // Si el usuario es administrador, agrega un feature adicional
    if (isAdmin) {
        features.push({
            name: "Administrar",
            icon: <Business fontSize="large" />,
            route: "/admin",
        });
    }

    return (
        <div className="container" style={{ paddingTop: "10rem" }}>
            <h3 style={{ textAlign: "start", color: "#606468" }}>Bienvenido {User.nombre_completo}.</h3>

            <div className="feature-grid">
                {features.map((feature, index) => (
                    <Link to={feature.route} key={index}>
                        <div className="feature-item">
                            {feature.icon}
                            <span>{feature.name}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default FeatureGrid;
