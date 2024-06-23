import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {
  agregarDocSub,
  agregarSubcoleccionDoc,
  uploadFilesConte,
} from "../firebase";

export default function AltaModulos({ cursoId }) {
  const [titulo, setTitulo] = React.useState("");
  const [items, setItems] = React.useState([]);
  const [errors, setErrors] = React.useState({ titulo: false, items: [] });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { titulo: false, items: [] };

    if (!titulo.trim()) {
      newErrors.titulo = true;
      isValid = false;
    }

    items.forEach((item, index) => {
      const itemErrors = { titulo: false, tipo: false, file: false };
      if (!item.titulo.trim()) {
        itemErrors.titulo = true;
        isValid = false;
      }
      if (!item.tipo.trim()) {
        itemErrors.tipo = true;
        isValid = false;
      }
      if (!item.url && !item.file) {
        itemErrors.file = true;
        isValid = false;
      }
      newErrors.items[index] = itemErrors;
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleAgregarModulo = async () => {
    if (!validateForm()) {
      alert("Por favor completa todos los campos requeridos.");
      return;
    }

    try {
      const moduloData = { titulo: titulo };
      const moduloRef = await agregarDocSub(
        moduloData,
        `cursos/${cursoId}/Modulos`
      );

      for (const item of items) {
        let url = item.url;
        if (item.file) {
          url = await uploadFilesConte(item.file);
        }

        const itemData = {
          titulo: item.titulo,
          tipo: item.tipo || "pdf",
          url: url,
        };

        await agregarSubcoleccionDoc(
          itemData,
          `cursos/${cursoId}/Modulos/${moduloRef.id}/items`
        );
      }

      setTitulo("");
      setItems([]);
      setErrors({ titulo: false, items: [] });
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
    setErrors({
      ...errors,
      items: [...errors.items, { titulo: false, tipo: false, file: false }],
    });
  };

  const handleEliminarItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);

    const newErrors = { ...errors };
    newErrors.items.splice(index, 1);
    setErrors(newErrors);
  };

  const handleChangeItem = (event, index, field) => {
    const newItems = [...items];
    if (field === "file") {
      newItems[index][field] = event.target.files[0];
    } else {
      newItems[index][field] = event.target.value;
    }
    setItems(newItems);

    const newErrors = { ...errors };
    if (field === "file") {
      newErrors.items[index][field] = !event.target.files[0];
    } else {
      newErrors.items[index][field] = !event.target.value.trim();
    }
    setErrors(newErrors);
  };

  return (
    <Box>
      <TextField
        label="Título del Módulo"
        value={titulo}
        onChange={(e) => {
          setTitulo(e.target.value);
          setErrors({ ...errors, titulo: !e.target.value.trim() });
        }}
        fullWidth
        margin="normal"
        error={errors.titulo}
        helperText={errors.titulo && "Este campo es obligatorio"}
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
            error={errors.items[index]?.titulo}
            helperText={
              errors.items[index]?.titulo && "Este campo es obligatorio"
            }
          />
          <TextField
            label="Tipo"
            value={item.tipo}
            onChange={(e) => handleChangeItem(e, index, "tipo")}
            fullWidth
            margin="normal"
            error={errors.items[index]?.tipo}
            helperText={
              errors.items[index]?.tipo && "Este campo es obligatorio"
            }
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
          {errors.items[index]?.file && (
            <p style={{ color: "red" }}>Este campo es obligatorio</p>
          )}
          <Button onClick={() => handleEliminarItem(index)}>Eliminar</Button>
        </Box>
      ))}
      <Button onClick={handleAgregarItem}>Agregar Ítem</Button>
      <Button onClick={handleAgregarModulo}>Agregar Módulo</Button>
    </Box>
  );
}
