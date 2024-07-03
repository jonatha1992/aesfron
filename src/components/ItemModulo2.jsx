import React, { useState } from "react";
import { Box, Button, TextField, Dialog, List, ListItem } from "@mui/material";
import { updateItem, deleteItem, uploadFile, deleteFile, agregarItem } from "../firebase";

export default function ItemModulo({ cursoId, moduloId, items, onUpdate }) {
    const [editingItem, setEditingItem] = useState(null);
    const [newItemData, setNewItemData] = useState({ titulo: "", tipo: "link", url: "" });
    const [openDialog, setOpenDialog] = useState(false);

    const handleEditItem = async () => {
        if (editingItem) {
            try {
                await updateItem(cursoId, moduloId, editingItem.id, editingItem);
                setEditingItem(null);
                onUpdate();
            } catch (error) {
                console.error("Error al actualizar el ítem:", error);
            }
        }
    };

    const handleDeleteItem = async (itemId) => {
        try {
            await deleteItem(cursoId, moduloId, itemId);
            onUpdate();
        } catch (error) {
            console.error("Error al eliminar el ítem:", error);
        }
    };

    const handleAddItem = async () => {
        if (newItemData.titulo && newItemData.url) {
            try {
                await agregarItem(cursoId, moduloId, newItemData);
                setNewItemData({ titulo: "", tipo: "link", url: "" });
                setOpenDialog(false);
                onUpdate();
            } catch (error) {
                console.error("Error al agregar el ítem:", error);
            }
        }
    };

    return (
        <Box>
            <Button onClick={() => setOpenDialog(true)}>Agregar Ítem</Button>
            <List>
                {items.map((item) => (
                    <ListItem key={item.id}>
                        {editingItem && editingItem.id === item.id ? (
                            <>
                                <TextField
                                    value={editingItem.titulo}
                                    onChange={(e) => setEditingItem({ ...editingItem, titulo: e.target.value })}
                                />
                                <TextField
                                    value={editingItem.url}
                                    onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                                />
                                <Button onClick={handleEditItem}>Guardar</Button>
                                <Button onClick={() => setEditingItem(null)}>Cancelar</Button>
                            </>
                        ) : (
                            <>
                                <span>{item.titulo}</span>
                                <a href={item.url} target="_blank" rel="noopener noreferrer">
                                    Ver
                                </a>
                                <Button onClick={() => setEditingItem(item)}>Editar</Button>
                                <Button onClick={() => handleDeleteItem(item.id)}>Eliminar</Button>
                            </>
                        )}
                    </ListItem>
                ))}
            </List>
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <TextField
                    value={newItemData.titulo}
                    onChange={(e) => setNewItemData({ ...newItemData, titulo: e.target.value })}
                    label="Título del nuevo ítem"
                />
                <TextField
                    value={newItemData.url}
                    onChange={(e) => setNewItemData({ ...newItemData, url: e.target.value })}
                    label="URL del nuevo ítem"
                />
                <Button onClick={handleAddItem}>Agregar</Button>
                <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
            </Dialog>
        </Box>
    );
}
