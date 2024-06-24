import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import {
  agregarDocSub,
  agregarSubcoleccionDoc,
  uploadFilesConte,
} from "../firebase";

export default function AltaModulos({ cursoId }) {
  const [titulo, setTitulo] = React.useState("");
  const [items, setItems] = React.useState([]);
  const [errors, setErrors] = React.useState({ titulo: false, items: [] });
  const [loading, setLoading] = React.useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { titulo: false, items: [] };

    if (!titulo.trim()) {
      newErrors.titulo = true;
      isValid = false;
    }

    if (items.length === 0) {
      alert("Debe agregar al menos un ítem al módulo.");
      return false;
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
      if (item.tipo === "link" && !item.url.trim()) {
        itemErrors.file = true;
        isValid = false;
      } else if (item.tipo !== "link" && !item.file) {
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

    setLoading(true);

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
    } finally {
      setLoading(false);
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
      newItems[index].url = "";
    } else {
      newItems[index][field] = event.target.value;
      if (field === "tipo" && event.target.value === "link") {
        newItems[index].file = null;
      }
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
      {cursoId && (
        <>
          <TextField
            label="Numero de unidad/modulo"
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
                label={`Título del contenido ${index + 1}`}
                value={item.titulo}
                onChange={(e) => handleChangeItem(e, index, "titulo")}
                fullWidth
                margin="normal"
                error={errors.items[index]?.titulo}
                helperText={
                  errors.items[index]?.titulo && "Este campo es obligatorio"
                }
              />
              <FormControl
                fullWidth
                margin="normal"
                error={errors.items[index]?.tipo}
              >
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={item.tipo}
                  onChange={(e) => handleChangeItem(e, index, "tipo")}
                  label="Tipo"
                >
                  <MenuItem value="link">Link</MenuItem>
                  <MenuItem value="pdf">PDF</MenuItem>
                  <MenuItem value="info">Info</MenuItem>
                </Select>
                {errors.items[index]?.tipo && (
                  <p style={{ color: "red" }}>Este campo es obligatorio</p>
                )}
              </FormControl>
              {item.tipo === "link" ? (
                <TextField
                  label="URL"
                  value={item.url}
                  onChange={(e) => handleChangeItem(e, index, "url")}
                  fullWidth
                  margin="normal"
                  error={errors.items[index]?.file}
                  helperText={
                    errors.items[index]?.file && "Este campo es obligatorio"
                  }
                />
              ) : (
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
              )}
              {item.file && <p>Archivo seleccionado: {item.file.name}</p>}
              {errors.items[index]?.file && (
                <p style={{ color: "red" }}>Este campo es obligatorio</p>
              )}
              <Button onClick={() => handleEliminarItem(index)}>
                Eliminar
              </Button>
            </Box>
          ))}
          <div className="w-full d-flex justify-content-end">
            <Button
              onClick={handleAgregarItem}
              style={{
                color: "var(--bs-gray-100)",
                backgroundColor: "var(--bs-indigo)",
              }}
            >
              Agregar Ítem
            </Button>
            <Button
              onClick={handleAgregarModulo}
              style={{
                color: "var(--bs-gray-100)",
                backgroundColor: "var(--bs-green)",
                fontWeight: "bold",
              }}
            >
              Agregar Módulo
            </Button>
          </div>
        </>
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
