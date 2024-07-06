import React, { useState, useEffect } from "react";
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
import { agregarDoc, actualizarDoc } from "../firebase";
import { uploadFiles, deleteFile } from "../controllers/controllerFile";
import { getCurso } from "../controllers/controllerCurso";
import { toast } from "react-toastify";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

const steps = ["Detalles del Curso", "Disertantes", "Tiempo y Lugar", "Objetivos", "Imagen"];

export default function CourseStepperGeneric({ cursoId, onCursoActualizado }) {
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
        imageUrl: "",
        workload: "",
        classes: "",
        modalidad: "",
        habilitado: true,
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState("");
    const [currentImageUrl, setCurrentImageUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (cursoId) {
            const fetchCourseData = async () => {
                try {
                    const curso = await getCurso(cursoId);
                    setCourseData(curso);
                    setCurrentImageUrl(curso.imageUrl);
                    setImagePreviewUrl(curso.imageUrl);
                } catch (error) {
                    console.error("Error al obtener los datos del curso:", error);
                    toast.error("Error al cargar los datos del curso");
                }
            };
            fetchCourseData();
        }
    }, [cursoId]);

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
                let updatedImageUrl = currentImageUrl;
                if (imageFile) {
                    updatedImageUrl = await uploadFiles(imageFile);
                    if (currentImageUrl) {
                        await deleteFile(currentImageUrl);
                    }
                } else if (currentImageUrl === "" && courseData.imageUrl) {
                    await deleteFile(courseData.imageUrl);
                    updatedImageUrl = "";
                }
                const finalCourseData = { ...courseData, imageUrl: updatedImageUrl };
                console.log("finalCourseData:", finalCourseData);
                if (cursoId) {
                    await actualizarDoc(cursoId, finalCourseData, "cursos");
                    onCursoActualizado("Curso actualizado con éxito");
                } else {
                    await agregarDoc(finalCourseData, "cursos");
                    onCursoActualizado("Curso creado con éxito");
                }

                resetForm();
            } catch (error) {
                console.error("Error al guardar el curso:", error);
                toast.error("Error al guardar el curso");
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
        setSkipped(newSkipped);
    };

    const resetForm = () => {
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
            imageUrl: "",
            workload: "",
            classes: "",
            modalidad: "",
            habilitado: true,
        });
        setImageFile(null);
        setImagePreviewUrl("");
        setCurrentImageUrl("");
    };

    const validateStepFields = () => {
        const fields = getStepFields(activeStep);
        for (let field of fields) {
            if (Array.isArray(courseData[field])) {
                // Para arrays, verifica que al menos un elemento no esté vacío
                if (!courseData[field].some((item) => item.trim() !== "")) {
                    toast.error(`Por favor añade al menos un ${field} en ${steps[activeStep]}`);
                    return false;
                }
            } else {
                // Para campos obligatorios
                if (["title", "coordinacion", "mail", "start", "duration", "place", "description", "modalidad"].includes(field)) {
                    if (!courseData[field] || courseData[field].trim() === "") {
                        toast.error(`Por favor completa el campo ${field} en ${steps[activeStep]}`);
                        return false;
                    }
                }
                // Para campos numéricos
                if (["price", "workload"].includes(field)) {
                    if (isNaN(courseData[field]) || courseData[field] <= 0) {
                        toast.error(`Por favor ingresa un valor válido para ${field} en ${steps[activeStep]}`);
                        return false;
                    }
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
                return ["meet", "test", "classes"];
            default:
                return [];
        }
    };

    const isStepSkipped = (step) => skipped.has(step);

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleChange = (event, field, index = null) => {
        const value = field === "habilitado" ? event.target.checked : event.target.value;
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
            setCurrentImageUrl(""); // Limpia la URL de la imagen actual

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        if (currentImageUrl) {
            deleteFile(currentImageUrl);
        }
        setImagePreviewUrl("");
        setCurrentImageUrl("");
        setImageFile(null);
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
                        imagePreviewUrl,
                        currentImageUrl,
                        handleRemoveImage
                    )}
                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                        <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                            Atrás
                        </Button>
                        <Box sx={{ flex: "1 1 auto" }} />
                        <FormControlLabel
                            control={
                                <Switch checked={courseData.habilitado} onChange={(e) => handleChange(e, "habilitado")} name="habilitado" />
                            }
                            label="Habilitado"
                        />
                        <Button onClick={handleNext} disabled={isSubmitting}>
                            {activeStep === steps.length - 1 ? "Finalizar" : "Siguiente"}
                        </Button>
                    </Box>
                </Box>
            </React.Fragment>
            <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isSubmitting}>
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
    imagePreviewUrl,
    currentImageUrl,
    handleRemoveImage
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
                        type="number"
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Correo Electrónico"
                        name="mail"
                        value={courseData.mail}
                        onChange={(e) => handleChange(e, "mail")}
                        fullWidth
                        required
                        type="email"
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Carga Horaria"
                        name="workload"
                        value={courseData.workload}
                        onChange={(e) => handleChange(e, "workload")}
                        fullWidth
                        required
                        type="number"
                        sx={{ mb: 2 }}
                    />
                </Box>
            );
        case 1:
            return (
                <Box>
                    {courseData.disertantes.map((disertante, index) => (
                        <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <TextField
                                label={`Disertante ${index + 1}`}
                                value={disertante}
                                onChange={(e) => handleChange(e, "disertantes", index)}
                                fullWidth
                                sx={{ mr: 1 }}
                            />
                            <IconButton
                                onClick={() => handleRemoveField(index, "disertantes")}
                                disabled={courseData.disertantes.length === 1}
                            >
                                <RemoveIcon />
                            </IconButton>
                        </Box>
                    ))}
                    <Button startIcon={<AddIcon />} onClick={() => handleAddField("disertantes")}>
                        Añadir Disertante
                    </Button>
                </Box>
            );
        case 2:
            return (
                <Box>
                    <TextField
                        label="Fecha de Inicio"
                        value={courseData.start}
                        onChange={(e) => handleChange(e, "start")}
                        fullWidth
                        required
                        InputLabelProps={{ shrink: true }}
                        sx={{ mb: 2 }}
                        placeholder="Ej. 05/08/2024 (4 clases)"
                    />
                    <TextField
                        label="Duración"
                        value={courseData.duration}
                        onChange={(e) => handleChange(e, "duration")}
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                        placeholder="Ej. 1 mes (Agosto)"
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
                        rows={4}
                        value={courseData.description}
                        onChange={(e) => handleChange(e, "description")}
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth required sx={{ mb: 2 }}>
                        <InputLabel>Modalidad</InputLabel>
                        <Select value={courseData.modalidad} onChange={(e) => handleChange(e, "modalidad")} label="Modalidad">
                            <MenuItem value="Remoto">Remoto</MenuItem>
                            <MenuItem value="Hibrido">Híbrido</MenuItem>
                            <MenuItem value="Presencial">Presencial</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            );
        case 3:
            return (
                <Box>
                    {courseData.objetivos.map((objetivo, index) => (
                        <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <TextField
                                label={`Objetivo ${index + 1}`}
                                value={objetivo}
                                onChange={(e) => handleChange(e, "objetivos", index)}
                                fullWidth
                                sx={{ mr: 1 }}
                            />
                            <IconButton onClick={() => handleRemoveField(index, "objetivos")} disabled={courseData.objetivos.length === 1}>
                                <RemoveIcon />
                            </IconButton>
                        </Box>
                    ))}
                    <Button startIcon={<AddIcon />} onClick={() => handleAddField("objetivos")}>
                        Añadir Objetivo
                    </Button>
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
                        placeholder="colocar el enlace Ej. https://meet.google.com"
                    />
                    <FormControl fullWidth required sx={{ mb: 2 }}>
                        <InputLabel>Evaluación</InputLabel>
                        <Select value={courseData.test} onChange={(e) => handleChange(e, "test")} label="Evaluación">
                            <MenuItem value="TP">TP</MenuItem>
                            <MenuItem value="ORAL">Oral</MenuItem>
                            <MenuItem value="ESCRITO">Escrito</MenuItem>
                            <MenuItem value="ECOE">ECOE</MenuItem>
                            <MenuItem value="TP/ECOE">TP/ECOE</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Día y horarios"
                        value={courseData.classes}
                        onChange={(e) => handleChange(e, "classes")}
                        fullWidth
                        sx={{ mb: 2 }}
                        placeholder="Ej. Lunes 10:00 - 11:00"
                    />
                    <input accept="image/*" style={{ display: "none" }} id="raised-button-file" type="file" onChange={handleImageChange} />
                    <label htmlFor="raised-button-file">
                        <Button variant="contained" component="span">
                            Subir Imagen
                        </Button>
                    </label>
                    {(imagePreviewUrl || currentImageUrl) && (
                        <Box sx={{ mt: 2 }} display={"flex"} flexDirection={"column"} alignItems={"center"}>
                            <img src={imagePreviewUrl || currentImageUrl} alt="Preview" style={{ maxWidth: "100%", maxHeight: 300 }} />
                            <Button variant="contained" color="secondary" onClick={handleRemoveImage} sx={{ mt: 1 }}>
                                Eliminar Imagen
                            </Button>
                        </Box>
                    )}
                </Box>
            );
        default:
            return "Paso desconocido";
    }
}
