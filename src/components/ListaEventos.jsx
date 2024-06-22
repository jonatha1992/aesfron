import React, { useState, useEffect } from "react";
import { obtenerRecientes } from "../firebase"; // Asegúrate de que esta ruta sea correcta
import ModificacionEventos from "./ModificacionEventos";
import { List, ListItem, ListItemText, Box } from "@mui/material";

const ListaEventos = () => {
  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [mostrarLista, setMostrarLista] = useState(true);

  const fetchEventos = async () => {
    const eventosRecientes = await obtenerRecientes(10, "eventos");
    setEventos(eventosRecientes);
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const handleSelectEvento = (evento) => {
    setEventoSeleccionado(evento.id);
    setMostrarLista(false);
  };

  const handleEventoActualizado = () => {
    fetchEventos();
    setMostrarLista(true);
  };

  return (
    <Box>
      {mostrarLista ? (
        <>
          <h2>Eventos Recientes</h2>
          <List>
            {eventos.map((evento) => (
              <ListItem
                button
                key={evento.id}
                onClick={() => handleSelectEvento(evento)}
              >
                <ListItemText primary={evento.TITULO} />
              </ListItem>
            ))}
          </List>
        </>
      ) : (
        eventoSeleccionado && (
          <ModificacionEventos
            eventoID={eventoSeleccionado}
            onEventoActualizado={handleEventoActualizado}
          />
        )
      )}
    </Box>
  );
};

export default ListaEventos;
