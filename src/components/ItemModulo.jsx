import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { updateItem, deleteItem, uploadFile, deleteFile } from "../firebase";

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
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

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

  const handleDeleteConfirmation = () => {
    setOpenConfirmDialog(true);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      setOpenConfirmDialog(false);

      // Eliminar el archivo de Firebase Storage
      if (itemData.url) {
        await deleteFile(itemData.url);
      }

      // Eliminar el item de la base de datos
      await deleteItem(item.id, cursoId, moduloId);

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
          <Button onClick={handleDeleteConfirmation}>Eliminar</Button>
        </div>
      )}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirmar eliminación"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Estás seguro de que quieres eliminar este ítem? Esta acción no se
            puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>Cancelar</Button>
          <Button onClick={handleDelete} autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
