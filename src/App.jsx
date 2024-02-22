import "./css/App.css";
import { Route, Routes } from "react-router-dom";
import { Talleres, Socios, Dashbord, AltaContenido, Login, Registro, DashbordAlumnosLayout, Layout } from "./pages";

import MisCursos from "./components/MisCursos";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import ProtectedRoute from "../src/components/ProtectedRoute.jsx";
import { useAuth } from "../src/context/AuthContext";
import UnidadesCursos from "./components/UnidadesCursos";
import Home2 from "./components/Home2";
import Inscripcion from "./pages/Inscripcion.jsx";

function App() {
    const { logout, User, setuUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        setuUser(null);
        navigate("/login");
    };

    return (
        <Layout>
            {/* <div className="container" style={{ marginTop: "220px", color: "white" }}> */}
            <Routes>
                <Route index element={<Home2 />} />
                <Route path="/login" element={<Login />} />
                <Route path="/inscripcion/:cursoid" element={<Inscripcion />} />
                <Route path="/Dashbord" element={<Dashbord />} />

                <Route path="/registro" element={<Registro />} />

                <Route element={<ProtectedRoute isAllowed={!!User} />}>
                    <Route path="/admin" element={<AltaContenido />} />
                    <Route path="/Alumnos" element={<DashbordAlumnosLayout />} />
                    <Route path="/unidades/:cursotitle/:cursoid" element={<UnidadesCursos />} />
                    <Route path="/inscripcion/:cursoid" element={<Inscripcion />} />
                    <Route path="/miscursos" element={<MisCursos />} />
                </Route>
            </Routes>
        </Layout>
    );
}
export default App;
