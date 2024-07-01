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
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { agregarDoc, uploadFiles } from "../firebase"; // Ajusta las rutas según sea necesario

const steps = [
  "Detalles del Curso",
  "Disertantes",
  "Tiempo y Lugar",
  "Objetivos",
  "Imagen",
];

export default function CourseStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [courseData, setCourseData] = useState({
    title: "",
    coordinacion: "",
    price: "",
    mail: "",
    disertantes: [""],
    start: "",
    duration: "",
    place: "",
    description: "",
    objetivos: [""],
    meet: "",
    test: "",
    imageURL: "",
    workload: "",
    classes: "", // Nuevo campo "clases"
    modalidad: "", // Nuevo campo "modalidad"
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = async () => {
    if (!validateStepFields()) return;

    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    if (activeStep === steps.length - 1) {
      setIsSubmitting(true);
      try {
        let imageUrl = courseData.imageURL;
        if (imageFile) {
          imageUrl = await uploadFiles(imageFile);
        }
        if (!imageUrl) {
          alert("Por favor, sube una imagen.");
          setIsSubmitting(false);
          return;
        }
        const finalCourseData = { ...courseData, imageURL: imageUrl };
        const courseId = await agregarDoc(finalCourseData, "cursos");
        console.log("Course ID:", courseId);

        setActiveStep(0);
        setCourseData({
          title: "",
          coordinacion: "",
          price: "",
          mail: "",
          disertantes: [""],
          start: "",
          duration: "",
          place: "",
          description: "",
          objetivos: [""],
          meet: "",
          test: "",
          imageURL: "",
          workload: "",
          classes: "",
          modalidad: "",
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

  const validateStepFields = () => {
    const fields = getStepFields(activeStep);
    for (let field of fields) {
      if (Array.isArray(courseData[field])) {
        if (courseData[field].some((item) => item.trim() === "")) {
          alert(`Por favor completa todos los campos en ${steps[activeStep]}`);
          return false;
        }
      } else {
        if (!courseData[field] || courseData[field].trim() === "") {
          alert(`Por favor completa todos los campos en ${steps[activeStep]}`);
          return false;
        }
      }
    }
    return true;
  };

  const getStepFields = (step) => {
    switch (step) {
      case 0:
        return ["title", "coordinacion", "price", "mail", "workload"];
      case 1:
        return ["disertantes"];
      case 2:
        return ["start", "duration", "place", "description", "modalidad"];
      case 3:
        return ["objetivos"];
      case 4:
        return ["meet", "test", "classes"]; // Agregar "classes" al último paso
      default:
        return [];
    }
  };

  const isStepOptional = (step) => false;

  const isStepSkipped = (step) => skipped.has(step);

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (event, field, index = null) => {
    const { value } = event.target;
    if (index !== null) {
      setCourseData((prevData) => {
        const newArray = [...prevData[field]];
        newArray[index] = value;
        return { ...prevData, [field]: newArray };
      });
    } else {
      setCourseData({ ...courseData, [field]: value });
    }
  };

  const handleAddField = (field) => {
    setCourseData((prevData) => ({
      ...prevData,
      [field]: [...prevData[field], ""],
    }));
  };

  const handleRemoveField = (index, field) => {
    setCourseData((prevData) => {
      const newArray = prevData[field].filter((_, i) => i !== index);
      return { ...prevData, [field]: newArray };
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);

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
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            Todos los pasos completados - has terminado
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleNext}>Finalizar</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>Paso {activeStep + 1}</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", pt: 2 }}>
            {getStepContent(
              activeStep,
              courseData,
              handleChange,
              handleAddField,
              handleRemoveField,
              handleImageChange,
              imageFile,
              imagePreviewUrl
            )}
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
              <Button onClick={handleNext} disabled={isSubmitting}>
                {activeStep === steps.length - 1 ? "Finalizar" : "Siguiente"}
              </Button>
            </Box>
          </Box>
        </React.Fragment>
      )}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isSubmitting}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
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
  imagePreviewUrl
) {
  switch (step) {
    case 0:
      return (
        <Box>
          <TextField
            label="Título"
            name="title"
            value={courseData.title}
            onChange={(e) => handleChange(e, "title")}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Coordinación"
            name="coordinacion"
            value={courseData.coordinacion}
            onChange={(e) => handleChange(e, "coordinacion")}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Precio"
            name="price"
            value={courseData.price}
            onChange={(e) => handleChange(e, "price")}
            fullWidth
            required
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              onKeyPress: (event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              },
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Correo Electrónico"
            name="mail"
            value={courseData.mail}
            onChange={(e) => handleChange(e, "mail")}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Carga Horaria"
            name="workload"
            value={courseData.workload}
            onChange={(e) => handleChange(e, "workload")}
            fullWidth
            required
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              onKeyPress: (event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              },
            }}
            sx={{ mb: 2 }}
          />
        </Box>
      );
    case 1:
      return (
        <Box>
          {courseData.disertantes.map((disertante, index) => (
            <TextField
              key={index}
              label={`Disertante ${index + 1}`}
              value={disertante}
              onChange={(e) => handleChange(e, "disertantes", index)}
              fullWidth
              sx={{ mb: 2 }}
            />
          ))}
          <IconButton
            onClick={() => handleAddField("disertantes")}
            sx={{ mb: 2 }}
          >
            <AddIcon />
          </IconButton>
          <IconButton
            onClick={() =>
              handleRemoveField(
                courseData.disertantes.length - 1,
                "disertantes"
              )
            }
            disabled={courseData.disertantes.length <= 1}
            sx={{ mb: 2 }}
          >
            <RemoveIcon />
          </IconButton>
        </Box>
      );
    case 2:
      return (
        <Box>
          <TextField
            label="Fecha de Inicio"
            type="date"
            value={courseData.start}
            onChange={(e) => handleChange(e, "start")}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Duración"
            value={courseData.duration}
            onChange={(e) => handleChange(e, "duration")}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Lugar"
            value={courseData.place}
            onChange={(e) => handleChange(e, "place")}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Descripción"
            multiline
            value={courseData.description}
            onChange={(e) => handleChange(e, "description")}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth required sx={{ mb: 2 }}>
            <InputLabel id="modalidad-label">Modalidad</InputLabel>
            <Select
              labelId="modalidad-label"
              id="modalidad"
              value={courseData.modalidad}
              onChange={(e) => handleChange(e, "modalidad")}
              label="Modalidad"
            >
              <MenuItem value="remoto">Remoto</MenuItem>
              <MenuItem value="hibrido">Híbrido</MenuItem>
              <MenuItem value="presencial">Presencial</MenuItem>
            </Select>
          </FormControl>
        </Box>
      );
    case 3:
      return (
        <Box>
          {courseData.objetivos.map((objetivo, index) => (
            <TextField
              key={index}
              label={`Objetivo ${index + 1}`}
              value={objetivo}
              onChange={(e) => handleChange(e, "objetivos", index)}
              fullWidth
              sx={{ mb: 2 }}
            />
          ))}
          <IconButton
            onClick={() => handleAddField("objetivos")}
            sx={{ mb: 2 }}
          >
            <AddIcon />
          </IconButton>
          <IconButton
            onClick={() =>
              handleRemoveField(courseData.objetivos.length - 1, "objetivos")
            }
            disabled={courseData.objetivos.length <= 1}
            sx={{ mb: 2 }}
          >
            <RemoveIcon />
          </IconButton>
        </Box>
      );
    case 4:
      return (
        <Box>
          <TextField
            label="Meet"
            value={courseData.meet}
            onChange={(e) => handleChange(e, "meet")}
            fullWidth
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth required sx={{ mb: 2 }}>
            <InputLabel id="test-label">Evaluacion</InputLabel>
            <Select
              labelId="test-label"
              id="test"
              value={courseData.test}
              onChange={(e) => handleChange(e, "test")}
              label="Evaluacion"
            >
              <MenuItem value="TP">TP</MenuItem>
              <MenuItem value="oral">Oral</MenuItem>
              <MenuItem value="escritos">Escrito</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Dia y horarios"
            value={courseData.classes}
            onChange={(e) => handleChange(e, "classes")}
            fullWidth
            sx={{ mb: 2 }}
          />
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
          {imagePreviewUrl && (
            <img
              src={imagePreviewUrl}
              alt="Preview"
              style={{ width: "100%", marginTop: 10 }}
            />
          )}
        </Box>
      );
    default:
      return "Paso desconocido";
  }
}
