import "./css/App.css";
import Menu from "./components/menu.jsx";
import { Route, Routes } from "react-router-dom";
import SubMenu from "./components/SubMenu";
import FormAltaCurso from "./components/FormAltaCurso";
import Register from "./pages/Register";
import Login from "./pages/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

import ProtectedRoute from "../src/components/ProtectedRoute.jsx";
import { useAuth } from "../src/context/AuthContext";
import Home from "./components/home";

function App() {
    const { logout, User, setuUser } = useAuth();

    const navigate = useNavigate();
    const handleLogout = async () => {
        await logout();
        setuUser(null);
        navigate("/login");
    };

    return (
        <>
            {User !== null ? (
                <button onClick={handleLogout}>Logout</button>
            ) : null}

            <Routes>
                <Route index element={<Menu />} />
                <Route path="/Home" element={<Home />} />
                <Route element={<ProtectedRoute isAllowed={!!User} />}>
                    <Route path="/cursos" element={<SubMenu />} />
                    <Route path="/eventos" element={<SubMenu />} />
                    <Route path="/contenido" element={<SubMenu />} />
                    <Route path="/cursos/alta" element={<FormAltaCurso />} />
                </Route>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </>
    );
}

export default App;
