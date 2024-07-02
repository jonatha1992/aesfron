import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import { updateItem, deleteItem, uploadFile } from "../firebase";

export default function ItemModulo({
  item,
  cursoId,
  moduloId,
  onUpdate,
  onDelete,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [itemData, setItemData] = useState({ ...item, cursoId, moduloId });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setItemData({ ...itemData, [name]: value });
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      if (file) {
        const url = await uploadFile(file, cursoId, moduloId, item.id);
        itemData.url = url;
      }
      console.log("Updating item with data: ", itemData);
      await updateItem(cursoId, moduloId, item.id, itemData);
      onUpdate(itemData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar el ítem:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteItem(cursoId, moduloId, item.id);
      onDelete(item.id);
    } catch (error) {
      console.error("Error al eliminar el ítem:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {isEditing ? (
        <Box
          style={{
            backgroundColor: "#b4ccd6",
            padding: "1rem",
            margin: "1rem",
            borderRadius: "1rem",
          }}
        >
          <TextField
            name="titulo"
            label="Título"
            value={itemData.titulo}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="url"
            label="URL"
            value={itemData.url}
            onChange={handleChange}
            fullWidth
            disabled
          />
          <input type="file" onChange={handleFileChange} />
          <Button onClick={handleUpdate}>Guardar</Button>
          <Button onClick={handleEditToggle}>Cancelar</Button>
        </Box>
      ) : (
        <div
          style={{
            border: "solid, 1px",
            background: "rgb(138, 225, 234)",
            marginBottom: "0.5rem",
          }}
        >
          <p>{itemData.titulo}</p>
          <a href={itemData.url} target="_blank" rel="noopener noreferrer">
            Descargar archivo
          </a>
          <Button onClick={handleEditToggle}>Editar</Button>
          <Button onClick={handleDelete}>Eliminar</Button>
        </div>
      )}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}
