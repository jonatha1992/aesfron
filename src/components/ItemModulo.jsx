import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

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
      if (file) {
        const url = await uploadFile(file, cursoId, moduloId, item.id);
        itemData.url = url;
      }
      console.log("Updating item with data: ", itemData); // Añadir log para depuración
      await updateItem(cursoId, moduloId, item.id, itemData);
      onUpdate(itemData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar el ítem:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteItem(cursoId, moduloId, item.id);
      onDelete(item.id);
    } catch (error) {
      console.error("Error al eliminar el ítem:", error);
    }
  };

  return (
    <Box>
      {isEditing ? (
        <Box>
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
        <div style={{ border: "solid, 1px", background: "#e4efef" }}>
          <p>{itemData.titulo}</p>
          <a href={itemData.url} target="_blank" rel="noopener noreferrer">
            Descargar archivo
          </a>
          <Button onClick={handleEditToggle}>Editar</Button>
        </div>
      )}
    </Box>
  );
}
