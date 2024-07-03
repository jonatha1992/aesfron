import React, { useEffect, useState } from "react";
import { getModulos, agregarModulo, eliminarModulo, actualizarModulo } from "../controllers/controllerCurso";
import { Box, Backdrop, CircularProgress, List, ListItem, Button, TextField, Dialog } from "@mui/material";
import ItemModulo from "./ItemModulo";

export default function ListaModulos({ cursoId }) {
    const [modulos, setModulos] = useState([]);
    const [selectedModulo, setSelectedModulo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [newModuloTitle, setNewModuloTitle] = useState("");
    const [editingModulo, setEditingModulo] = useState(null);

    useEffect(() => {
        fetchModulos();
    }, [cursoId]);

    const fetchModulos = async () => {
        setLoading(true);
        try {
            const modulosData = await getModulos(cursoId);
            setModulos(modulosData);
        } catch (error) {
            console.error("Error al obtener los módulos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleModuloClick = (modulo) => {
        setSelectedModulo(modulo);
    };

    const handleAddModulo = async () => {
        if (newModuloTitle.trim()) {
            try {
                await agregarModulo(cursoId, { titulo: newModuloTitle });
                setNewModuloTitle("");
                setOpenDialog(false);
                fetchModulos();
            } catch (error) {
                console.error("Error al agregar módulo:", error);
            }
        }
    };

    const handleEditModulo = async () => {
        if (editingModulo && editingModulo.titulo.trim()) {
            try {
                await actualizarModulo(cursoId, editingModulo.id, { titulo: editingModulo.titulo });
                setEditingModulo(null);
                fetchModulos();
            } catch (error) {
                console.error("Error al editar módulo:", error);
            }
        }
    };

    const handleDeleteModulo = async (moduloId) => {
        try {
            await eliminarModulo(cursoId, moduloId);
            fetchModulos();
            if (selectedModulo && selectedModulo.id === moduloId) {
                setSelectedModulo(null);
            }
        } catch (error) {
            console.error("Error al eliminar módulo:", error);
        }
    };

    return (
        <Box>
            <Backdrop open={loading} style={{ zIndex: 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
            {!loading && (
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
                    <div className="col-3">
                        <Button onClick={() => setOpenDialog(true)}>Agregar Módulo</Button>
                        <List>
                            {modulos.map((modulo) => (
                                <ListItem key={modulo.id}>
                                    {editingModulo && editingModulo.id === modulo.id ? (
                                        <>
                                            <TextField
                                                value={editingModulo.titulo}
                                                onChange={(e) => setEditingModulo({ ...editingModulo, titulo: e.target.value })}
                                            />
                                            <Button onClick={handleEditModulo}>Guardar</Button>
                                            <Button onClick={() => setEditingModulo(null)}>Cancelar</Button>
                                        </>
                                    ) : (
                                        <>
                                            <span onClick={() => handleModuloClick(modulo)}>{modulo.titulo}</span>
                                            <Button onClick={() => setEditingModulo(modulo)}>Editar</Button>
                                            <Button onClick={() => handleDeleteModulo(modulo.id)}>Eliminar</Button>
                                        </>
                                    )}
                                </ListItem>
                            ))}
                        </List>
                    </div>
                    {selectedModulo && (
                        <div className="col-9">
                            <h3>{selectedModulo.titulo}</h3>
                            <ItemModulo
                                cursoId={cursoId}
                                moduloId={selectedModulo.id}
                                items={selectedModulo.items}
                                onUpdate={fetchModulos}
                            />
                        </div>
                    )}
                </div>
            )}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <TextField value={newModuloTitle} onChange={(e) => setNewModuloTitle(e.target.value)} label="Título del nuevo módulo" />
                <Button onClick={handleAddModulo}>Agregar</Button>
                <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
            </Dialog>
        </Box>
    );
}
