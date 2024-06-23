import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { agregarDoc } from "../firebase"; // Ajusta la importación según tu configuración
import { uploadFiles } from "../firebase"; // Ajusta la importación según tu configuración

export default function AltaModulos({ cursoId }) {
  const [titulo, setTitulo] = React.useState("");
  const [items, setItems] = React.useState([]);

  const handleAgregarModulo = async () => {
    try {
      // Subir archivos antes de agregar el módulo
      const itemsWithUrls = await Promise.all(
        items.map(async (item) => {
          if (item.file) {
            const url = await uploadFiles(item.file);
            return { ...item, url };
          }
          return item;
        })
      );

      const moduloData = {
        titulo: titulo,
        items: itemsWithUrls.map((item) => ({
          titulo: item.titulo,
          tipo: item.tipo || "pdf",
          url: item.url,
        })),
      };

      await agregarDoc(moduloData, `cursos/${cursoId}/Modulos`);

      setTitulo("");
      setItems([]);
      alert("Módulo agregado exitosamente!");
    } catch (error) {
      console.error("Error al agregar el módulo:", error);
      alert(
        "Hubo un error al agregar el módulo. Por favor, intenta nuevamente."
      );
    }
  };

  const handleAgregarItem = () => {
    setItems([...items, { titulo: "", tipo: "", url: "", file: null }]);
  };

  const handleEliminarItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleChangeItem = (event, index, field) => {
    const newItems = [...items];
    if (field === "file") {
      newItems[index][field] = event.target.files[0];
    } else {
      newItems[index][field] = event.target.value;
    }
    setItems(newItems);
  };

  return (
    <Box>
      <TextField
        label="Título del Módulo"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        fullWidth
        margin="normal"
      />
      {items.map((item, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            marginBottom: 2,
          }}
        >
          <TextField
            label={`Título del ítem ${index + 1}`}
            value={item.titulo}
            onChange={(e) => handleChangeItem(e, index, "titulo")}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Tipo"
            value={item.tipo}
            onChange={(e) => handleChangeItem(e, index, "tipo")}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ marginTop: 1 }}
          >
            Seleccionar Archivo
            <input
              type="file"
              hidden
              onChange={(e) => handleChangeItem(e, index, "file")}
            />
          </Button>
          {item.file && <p>Archivo seleccionado: {item.file.name}</p>}
          <Button onClick={() => handleEliminarItem(index)}>Eliminar</Button>
        </Box>
      ))}
      <Button onClick={handleAgregarItem}>Agregar Ítem</Button>
      <Button onClick={handleAgregarModulo}>Agregar Módulo</Button>
    </Box>
  );
}
