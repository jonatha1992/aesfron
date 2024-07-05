import "./css/App.css";
import { Route, Routes } from "react-router-dom";
import MisCursos from "./components/MisCursos.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import ProtectedRoute from "../src/components/ProtectedRoute.jsx";
import { useAuth } from "../src/context/AuthContext.jsx";
import UnidadesCursos from "./components/UnidadesCursos.jsx";
import Home2 from "./components/Home2.jsx";
import MiPerfil from "./components/MiPerfil.jsx";
// import AltaContenido from "./pages/AltaContenido.jsx";
import Login from "./pages/Login.jsx";
import Registro from "./pages/Registro.jsx";
import Inscripcion from "./pages/Inscripcion.jsx";
import DashbordAlumnosLayout from "./pages/DashbordAlumnosLayout.jsx";
import Layout from "./pages/Layout.jsx";
import Admin from "./components/Admin.jsx";
// import { AltaContenido, Login, Registro, DashbordAlumnosLayout, Layout } from "./pages";

function App() {
    const { User } = useAuth();

    return (
        <Layout>
            {/* <div className="container" style={{ marginTop: "220px", color: "white" }}> */}
            <Routes>
                <Route index element={<Home2 />} />
                <Route path="/login" element={<Login />} />
                <Route path="/inscripcion/:cursoid" element={<Inscripcion />} />

                <Route path="/registro" element={<Registro />} />

                <Route element={<ProtectedRoute isAllowed={!!User} />}>
                    <Route path="/Alumnos" element={<DashbordAlumnosLayout />} />
                    <Route path="/unidades/:cursotitle/:cursoid" element={<UnidadesCursos />} />
                    <Route path="/inscripcion/:cursoid" element={<Inscripcion />} />

                    <Route path="/perfil" element={<MiPerfil />} />
                    <Route path="/miscursos" element={<MisCursos />} />
                    <Route path="/admin" element={<Admin />} />
                </Route>
            </Routes>
        </Layout>
    );
}
export default App;
