import React, { useState } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { agregarDoc } from "../firebase"; // Actualiza la ruta según sea necesario
import { uploadFiles } from "../firebase"; // Actualiza la ruta según sea necesario

const steps = [
  "Detalles del Curso",
  "Coordinación y Disertantes",
  "Fecha y Duración",
  "Descripción y Lugar",
  "Objetivos",
  "Imagen del Curso", // Nuevo paso para subir imagen
];

export default function CourseStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [courseData, setCourseData] = useState({
    title: "",
    coordinacion: "",
    disertantes: [""],
    start: "",
    duration: "",
    description: "",
    place: "",
    objetivos: [""],
    imageUrl: "", // Nueva propiedad para la URL de la imagen
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(""); // Estado para la vista previa de la imagen
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controlar la subida del formulario

  const isStepOptional = (step) => step === 1;

  const isStepSkipped = (step) => skipped.has(step);

  const handleNext = async () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    if (activeStep === steps.length - 1) {
      setIsSubmitting(true);
      try {
        let imageUrl = "";
        if (imageFile) {
          imageUrl = await uploadFiles(imageFile);
        }
        const finalCourseData = { ...courseData, imageUrl: imageUrl };
        const cursoID = await agregarDoc(finalCourseData, "cursos"); // Cambia 'cursos' por el nombre de tu colección
        console.log("Curso guardado con ID:", cursoID);

        // Reiniciar el estado después de guardar el curso
        setActiveStep(0);
        setCourseData({
          title: "",
          coordinacion: "",
          disertantes: [""],
          start: "",
          duration: "",
          description: "",
          place: "",
          objetivos: [""],
          imageUrl: "",
        });
        setImageFile(null);
        setImagePreviewUrl("");
      } catch (error) {
        console.error("Error al guardar el curso:", error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("No puedes saltar un paso que no es opcional.");
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleChange = (event, index, field) => {
    const { value } = event.target;
    const newData = Array.isArray(courseData[field])
      ? [...courseData[field]]
      : [courseData[field]];
    newData[index] = value;
    setCourseData({ ...courseData, [field]: newData });
  };

  const handleAddField = (field) => {
    setCourseData({ ...courseData, [field]: [...courseData[field], ""] });
  };

  const handleRemoveField = (index, field) => {
    const newData = courseData[field].filter((_, i) => i !== index);
    setCourseData({ ...courseData, [field]: newData });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);

      // Mostrar vista previa de la imagen seleccionada
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          {/* Contenido después de completar todos los pasos */}
          <Typography sx={{ mt: 2, mb: 1 }}>
            Todos los pasos completados - has terminado
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            {/* Botón de reinicio */}
            <Button onClick={handleNext}>Finalizar</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          {/* Contenido del paso actual */}
          <Typography sx={{ mt: 2, mb: 1 }}>Paso {activeStep + 1}</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", pt: 2 }}>
            {/* Contenido dinámico según el paso */}
            {getStepContent(
              activeStep,
              courseData,
              handleChange,
              handleAddField,
              handleRemoveField,
              handleImageChange,
              imageFile,
              imagePreviewUrl // Pasar imagePreviewUrl a getStepContent
            )}
            {/* Botones de navegación y acciones */}
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Atrás
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              {isStepOptional(activeStep) && (
                <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                  Saltar
                </Button>
              )}
              <Button onClick={handleNext} disabled={isSubmitting}>
                {activeStep === steps.length - 1 ? "Finalizar" : "Siguiente"}
              </Button>
            </Box>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}

function getStepContent(
  step,
  courseData,
  handleChange,
  handleAddField,
  handleRemoveField,
  handleImageChange,
  imageFile,
  imagePreviewUrl // Asegúrate de recibir imagePreviewUrl como argumento
) {
  switch (step) {
    case 0:
      return (
        <Box>
          <TextField
            label="Título"
            name="title"
            value={courseData.title}
            onChange={(e) => handleChange(e, 0, "title")}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Coordinación"
            name="coordinacion"
            value={courseData.coordinacion}
            onChange={(e) => handleChange(e, 0, "coordinacion")}
            fullWidth
            margin="normal"
          />
        </Box>
      );
    case 1:
      return (
        <Box>
          {courseData.disertantes.map((disertante, index) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}
            >
              <TextField
                label={`Disertante ${index + 1}`}
                name={`disertante-${index}`}
                value={disertante}
                onChange={(e) => handleChange(e, index, "disertantes")}
                fullWidth
                margin="normal"
              />
              <IconButton
                onClick={() => handleRemoveField(index, "disertantes")}
                disabled={courseData.disertantes.length === 1}
              >
                <RemoveIcon />
              </IconButton>
            </Box>
          ))}
          <Button
            variant="outlined"
            onClick={() => handleAddField("disertantes")}
            startIcon={<AddIcon />}
          >
            Añadir Añadir Disertante
          </Button>
        </Box>
      );
    case 2:
      return (
        <Box>
          <TextField
            label="Inicio"
            name="start"
            value={courseData.start}
            onChange={(e) => handleChange(e, 0, "start")}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Duración"
            name="duration"
            value={courseData.duration}
            onChange={(e) => handleChange(e, 0, "duration")}
            fullWidth
            margin="normal"
          />
        </Box>
      );
    case 3:
      return (
        <Box>
          <TextField
            label="Descripción"
            name="description"
            value={courseData.description}
            onChange={(e) => handleChange(e, 0, "description")}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Lugar"
            name="place"
            value={courseData.place}
            onChange={(e) => handleChange(e, 0, "place")}
            fullWidth
            margin="normal"
          />
        </Box>
      );
    case 4:
      return (
        <Box>
          {courseData.objetivos.map((objetivo, index) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}
            >
              <TextField
                label={`Objetivo ${index + 1}`}
                name={`objetivo-${index}`}
                value={objetivo}
                onChange={(e) => handleChange(e, index, "objetivos")}
                fullWidth
                margin="normal"
              />
              <IconButton
                onClick={() => handleRemoveField(index, "objetivos")}
                disabled={courseData.objetivos.length === 1}
              >
                <RemoveIcon />
              </IconButton>
            </Box>
          ))}
          <Button
            variant="outlined"
            onClick={() => handleAddField("objetivos")}
            startIcon={<AddIcon />}
          >
            Añadir Objetivo
          </Button>
        </Box>
      );
    case 5:
      return (
        <Box>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="raised-button-file"
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="raised-button-file">
            <Button variant="contained" component="span">
              Subir Imagen
            </Button>
          </label>
          {imageFile && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              Nombre del archivo: {imageFile.name}
            </Typography>
          )}
          {imagePreviewUrl && (
            <Box sx={{ mt: 2 }}>
              <img
                src={imagePreviewUrl}
                alt="Preview"
                style={{ maxWidth: "100%", maxHeight: 400 }}
              />
            </Box>
          )}
        </Box>
      );

    default:
      return "Paso desconocido";
  }
}
