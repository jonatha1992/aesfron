import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { actualizarDoc } from "../firebase";
import { getCurso } from "../controllers/controllerCurso";
import { uploadFiles } from "../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const steps = [
  "Detalles del Curso",
  "Coordinación y Disertantes",
  "Fecha y Duración",
  "Descripción y Lugar",
  "Objetivos",
  "Imagen del Curso",
];

export default function CourseModificationStepper({ cursoId }) {
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
    classes: "",
    modalidad: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const curso = await getCurso(cursoId);
        setCourseData(curso);
        setImagePreviewUrl(curso.imageURL);
      } catch (error) {
        console.error("Error al obtener los datos del curso:", error);
      }
    };
    fetchCourseData();
  }, [cursoId]);

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
        let imageUrl = courseData.imageURL;
        if (imageFile) {
          imageUrl = await uploadFiles(imageFile);
        }
        const updatedCourseData = { ...courseData, imageURL: imageUrl };
        await actualizarDoc(cursoId, updatedCourseData, "cursos");
        toast.success("actualizado con éxito");
        // Reiniciar el formulario
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
        setActiveStep(0);
      } catch (error) {
        console.error("Error al actualizar el curso:", error);
        toast.error("Error al actualizar el curso");
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

  const handleChange = (event, field, index) => {
    const { value } = event.target;
    if (index !== undefined) {
      const newData = [...courseData[field]];
      newData[index] = value;
      setCourseData({ ...courseData, [field]: newData });
    } else {
      setCourseData({ ...courseData, [field]: value });
    }
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <ToastContainer autoClose={2000} />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isSubmitting}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            if (isStepOptional(index)) {
              labelProps.optional = (
                <Typography variant="caption">Opcional</Typography>
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
    </>
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
            margin="normal"
            required
          />
          <TextField
            label="Coordinación"
            name="coordinacion"
            value={courseData.coordinacion}
            onChange={(e) => handleChange(e, "coordinacion")}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Precio"
            name="price"
            value={courseData.price}
            onChange={(e) => handleChange(e, "price")}
            fullWidth
            margin="normal"
            required
            type="number"
            inputProps={{ min: 0 }}
          />
          <TextField
            label="Correo Electrónico"
            name="mail"
            value={courseData.mail}
            onChange={(e) => handleChange(e, "mail")}
            fullWidth
            margin="normal"
            required
            type="email"
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
                onChange={(e) => handleChange(e, "disertantes", index)}
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
            Añadir Disertante
          </Button>
        </Box>
      );
    case 2:
      return (
        <Box>
          <TextField
            label="Fecha de Inicio"
            name="start"
            type="date"
            value={courseData.start}
            onChange={(e) => handleChange(e, "start")}
            fullWidth
            margin="normal"
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Duración (en horas)"
            name="duration"
            type="number"
            value={courseData.duration}
            onChange={(e) => handleChange(e, "duration")}
            fullWidth
            margin="normal"
            required
            inputProps={{ min: 0 }}
          />
          <TextField
            label="Modalidad"
            name="modalidad"
            value={courseData.modalidad}
            onChange={(e) => handleChange(e, "modalidad")}
            fullWidth
            margin="normal"
            required
            select
          >
            <MenuItem value="remoto">Remoto</MenuItem>
            <MenuItem value="hibrido">Híbrido</MenuItem>
            <MenuItem value="presencial">Presencial</MenuItem>
          </TextField>
        </Box>
      );
    case 3:
      return (
        <Box>
          <TextField
            label="Lugar"
            name="place"
            value={courseData.place}
            onChange={(e) => handleChange(e, "place")}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Descripción"
            name="description"
            value={courseData.description}
            onChange={(e) => handleChange(e, "description")}
            fullWidth
            margin="normal"
            required
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
                onChange={(e) => handleChange(e, "objetivos", index)}
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
