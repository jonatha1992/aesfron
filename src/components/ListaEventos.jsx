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
        const x = eventos.find((e) => e.id === evento.id);
        setEventoSeleccionado(x);
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
                    <h2 className="  mt-4">Eventos Recientes</h2>
                    <List>
                        {eventos.map((evento) => (
                            <ListItem
                                button
                                key={evento.id}
                                onClick={() => handleSelectEvento(evento)}
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
                                <ListItemText primary={evento.TITULO} secondary={evento.SUBTITULO} />
                            </ListItem>
                        ))}
                    </List>
                </>
            ) : (
                eventoSeleccionado && <ModificacionEventos evento={eventoSeleccionado} onEventoActualizado={handleEventoActualizado} />
            )}
        </Box>
    );
};

export default ListaEventos;
