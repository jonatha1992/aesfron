import React, { useEffect, useState } from "react";
import { getModulos } from "../controllers/controllerCurso"; // Ajusta la importación según tu configuración
import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ItemModulo from "./ItemModulo";
import MenuItem from "@mui/material/MenuItem";
import { List, ListItem } from "@mui/material";

export default function ListaModulos({ cursoId }) {
  const [modulos, setModulos] = useState([]);
  const [selectedModulo, setSelectedModulo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModulos = async () => {
      try {
        const modulosData = await getModulos(cursoId);
        setModulos(modulosData);
      } catch (error) {
        console.error("Error al obtener los módulos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModulos();
  }, [cursoId]);

  const handleModuloClick = (modulo) => {
    setSelectedModulo(modulo);
  };

  const handleItemUpdate = (updatedItem) => {
    setSelectedModulo((prevModulo) => ({
      ...prevModulo,
      items: prevModulo.items.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      ),
    }));
  };

  const handleItemDelete = (itemId) => {
    setSelectedModulo((prevModulo) => ({
      ...prevModulo,
      items: prevModulo.items.filter((item) => item.id !== itemId),
    }));
  };

  return (
    <Box>
      <Backdrop open={loading} style={{ zIndex: 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {!loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "2rem",
          }}
        >
          <div className="col-3">
            <List>
              {modulos.map((modulo) => (
                <ListItem
                  key={modulo.id}
                  onClick={() => handleModuloClick(modulo)}
                  sx={{
                    borderRadius: "8px",
                    border: "1px solid var(--color1)",
                    margin: "8px 0",
                    transition: "background 0.3s ease",
                    "&:hover": {
                      background: "var(--color2)",
                      color: "white",
                    },
                  }}
                >
                  {modulo.titulo}
                </ListItem>
              ))}
            </List>
          </div>
          {selectedModulo && (
            <div className="col-9">
              <h3>{selectedModulo.titulo}</h3>
              <ul>
                {selectedModulo.items.map((item) => (
                  <ItemModulo
                    key={item.id}
                    item={item}
                    cursoId={cursoId}
                    moduloId={selectedModulo.id}
                    onUpdate={handleItemUpdate}
                    onDelete={handleItemDelete}
                  />
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Box>
  );
}
