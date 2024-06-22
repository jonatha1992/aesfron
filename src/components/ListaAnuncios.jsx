import React, { useState, useEffect } from "react";
import { obtenerRecientes } from "../firebase"; // Asegúrate de que esta ruta sea correcta
import ModificacionAnuncios from "./ModificacionAnuncios";
import { List, ListItem, ListItemText, Box } from "@mui/material";

const ListaAnuncios = () => {
  const [anuncios, setAnuncios] = useState([]);
  const [anuncioSeleccionado, setAnuncioSeleccionado] = useState(null);
  const [mostrarLista, setMostrarLista] = useState(true);

  const fetchAnuncios = async () => {
    const eventosRecientes = await obtenerRecientes(10, "anuncios");
    setAnuncios(eventosRecientes);
  };

  useEffect(() => {
    fetchAnuncios();
  }, []);

  const handleSelectAnuncios = (anuncio) => {
    setAnuncioSeleccionado(anuncio.id);
    setMostrarLista(false);
  };

  const handleEventoActualizado = () => {
    fetchAnuncios();
    setMostrarLista(true);
  };

  return (
    <Box>
      {mostrarLista ? (
        <>
          <h2>Anuncios Recientes</h2>
          <List>
            {anuncios.map((anuncio) => (
              <ListItem
                button
                key={anuncio.id}
                onClick={() => handleSelectAnuncios(anuncio)}
              >
                <ListItemText primary={anuncio.TITULO} />
              </ListItem>
            ))}
          </List>
        </>
      ) : (
        anuncioSeleccionado && (
          <ModificacionAnuncios
            anuncioID={anuncioSeleccionado}
            onAnuncioActualizado={handleEventoActualizado}
          />
        )
      )}
    </Box>
  );
};

export default ListaAnuncios;
