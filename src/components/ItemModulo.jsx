import React, { useState } from "react";
import { Box, Button, TextField, Dialog, List, ListItem, IconButton, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { updateItem, deleteItem, agregarItem } from "../controllers/controllerItem";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import LinkIcon from "@mui/icons-material/Link";
import InfoIcon from "@mui/icons-material/Info";

const getIcon = (tipo) => {
    switch (tipo.toLowerCase()) {
        case "pdf":
            return <PictureAsPdfIcon style={iconStyle} />;
        case "link":
            return <LinkIcon style={iconStyle} />;
        case "info":
            return <InfoIcon style={iconStyle} />;
        default:
            return null;
    }
};

const iconStyle = {
    width: "1.5rem",
    height: "1.5rem",
    marginRight: "5px",
};

export default function ItemModulo({ cursoId, moduloId, items, onUpdate }) {
    const [editingItem, setEditingItem] = useState(null);
    const [newItemData, setNewItemData] = useState({ titulo: "", tipo: "info", url: "", file: null });
    const [openDialog, setOpenDialog] = useState(false);
    const [errors, setErrors] = useState({});

    const validateItem = (item) => {
        const errors = {};
        if (!item.titulo.trim()) errors.titulo = "El título es obligatorio";
        if (item.tipo === "link" && !item.url.trim()) errors.url = "La URL es obligatoria para links";
        if (item.tipo === "pdf" && !item.file) errors.file = "Debe seleccionar un archivo PDF";
        return errors;
    };

    const handleEditItem = async () => {
        const validationErrors = validateItem(editingItem);
        if (Object.keys(validationErrors).length === 0) {
            try {
                await updateItem(cursoId, moduloId, editingItem.id, editingItem);
                setEditingItem(null);
                setOpenDialog(false);
                onUpdate();
            } catch (error) {
                console.error("Error al actualizar el ítem:", error);
            }
        } else {
            setErrors(validationErrors);
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
        const validationErrors = validateItem(newItemData);
        if (Object.keys(validationErrors).length === 0) {
            try {
                await agregarItem(cursoId, moduloId, newItemData);
                setNewItemData({ titulo: "", tipo: "info", url: "", file: null });
                setOpenDialog(false);
                onUpdate();
            } catch (error) {
                console.error("Error al agregar el ítem:", error);
            }
        } else {
            setErrors(validationErrors);
        }
    };

    const handleChange = (e, isEditing = false) => {
        const { name, value, files } = e.target;
        const updatedData = isEditing ? { ...editingItem } : { ...newItemData };

        if (name === "file") {
            updatedData.file = files[0];
        } else {
            updatedData[name] = value;
        }

        if (name === "tipo") {
            updatedData.url = "";
            updatedData.file = null;
        }

        isEditing ? setEditingItem(updatedData) : setNewItemData(updatedData);
        setErrors({});
    };

    const renderForm = (data, isEditing = false) => (
        <>
            <TextField
                name="titulo"
                value={data.titulo}
                onChange={(e) => handleChange(e, isEditing)}
                label="Título del ítem"
                fullWidth
                margin="normal"
                error={!!errors.titulo}
                helperText={errors.titulo}
            />
            <FormControl fullWidth margin="normal">
                <InputLabel>Tipo de contenido</InputLabel>
                <Select name="tipo" value={data.tipo} onChange={(e) => handleChange(e, isEditing)}>
                    <MenuItem value="info">Info</MenuItem>
                    <MenuItem value="pdf">PDF</MenuItem>
                    <MenuItem value="link">Link</MenuItem>
                </Select>
            </FormControl>
            {data.tipo === "link" && (
                <TextField
                    name="url"
                    value={data.url}
                    onChange={(e) => handleChange(e, isEditing)}
                    label="URL"
                    fullWidth
                    margin="normal"
                    error={!!errors.url}
                    helperText={errors.url}
                />
            )}
            {data.tipo === "pdf" && (
                <Button variant="contained" component="label" fullWidth sx={{ marginTop: 2 }}>
                    Subir PDF
                    <input type="file" hidden name="file" accept=".pdf" onChange={(e) => handleChange(e, isEditing)} />
                </Button>
            )}
            {errors.file && <p style={{ color: "red" }}>{errors.file}</p>}
        </>
    );

    return (
        <Box>
            <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
                Agregar Ítem
            </Button>
            <List>
                {items.map((item) => (
                    <ListItem
                        key={item.id}
                        sx={{
                            borderRadius: "8px",
                            border: "1px solid var(--color1)",
                            margin: "8px 0",
                            transition: "background 0.3s ease",
                            "&:hover": {
                                background: "var(--color2)",
                                color: "white",
                            },
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <div>
                            {getIcon(item.tipo)}
                            <span>{item.titulo}</span>
                        </div>
                        <div>
                            {item.tipo.toLowerCase() !== "info" && (
                                <a className="btn btn-primary" href={item.url} target="_blank" rel="noopener noreferrer">
                                    Ver
                                </a>
                            )}
                            <IconButton
                                onClick={() => {
                                    setEditingItem(item);
                                    setOpenDialog(true);
                                }}
                            >
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDeleteItem(item.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </div>
                    </ListItem>
                ))}
            </List>

            <Dialog
                open={openDialog}
                onClose={() => {
                    setOpenDialog(false);
                    setEditingItem(null);
                    setNewItemData({ titulo: "", tipo: "info", url: "", file: null });
                    setErrors({});
                }}
                sx={{ textAlign: "center" }}
                fullWidth
            >
                <h2 className="text-center mt-3">{editingItem ? "Editar" : "Agregar"} Ítem</h2>
                <div className="d-flex flex-column mx-3 mt-0">{editingItem ? renderForm(editingItem, true) : renderForm(newItemData)}</div>

                <div style={{ display: "flex", justifyContent: "space-between", margin: "16px" }}>
                    <Button onClick={editingItem ? handleEditItem : handleAddItem}>{editingItem ? "Guardar" : "Agregar"}</Button>
                    <Button
                        onClick={() => {
                            setOpenDialog(false);
                            setEditingItem(null);
                            setNewItemData({ titulo: "", tipo: "info", url: "", file: null });
                            setErrors({});
                        }}
                    >
                        Cancelar
                    </Button>
                </div>
            </Dialog>
        </Box>
    );
}
