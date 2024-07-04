import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, useFormikContext } from "formik";
import * as Yup from "yup";
import {
    Button,
    Stepper,
    Step,
    StepLabel,
    Box,
    Backdrop,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";

import { FormikTextField, FormikSelectField, FormikDatePicker, FormikRadioButton } from "../components/Controles.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { agregarUser } from "../controllers/controllerUser.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/registro.css";
const steps = ["Personales", "Contacto", "Formación", "Institución", "Inicio"];

import { countries, getStates } from "../security/Tools";
const defaultCountry = { label: "Argentina", value: "AR" };
const defaultState = { label: "Buenos Aires", value: "B" };

const validationSchemas = {
    0: Yup.object().shape({
        nombre_completo: Yup.string().required("El nombre es obligatorio"),
        DNI: Yup.string().required("El número es obligatorio"),
        fecha_nacimiento: Yup.date().required("La fecha de nacimiento es obligatoria").typeError("Debe ser una fecha"),
        pais: Yup.string().required("El país es obligatorio"),
        provincia: Yup.string().required("La provincia o estado es obligatorio"),
    }),
    1: Yup.object().shape({
        localidad: Yup.string().required("La localidad es obligatoria"),
        codigo_postal: Yup.string().required("El código postal es obligatorio"),
        calle: Yup.string().required("La calle es obligatoria"),
        numero: Yup.string().required("El número es obligatorio"),
        depto: Yup.string(),
        piso: Yup.string(),
        telefono: Yup.string().required("El número de celular es obligatorio"),
    }),
    2: Yup.object().shape({
        nivel: Yup.string().required("El nivel de  formacion es obligatorio"),
    }),
    3: Yup.object().shape({
        institucion: Yup.string().required("La institución es obligatoria"),
        puesto: Yup.string().required("El puesto es obligatorio"),
    }),
    4: Yup.object().shape({
        email: Yup.string().email("Correo electrónico no válido").required("El correo electrónico es obligatorio"),
        password: Yup.string().required("La contraseña es obligatoria").min(6, "La contraseña debe tener al menos 6 caracteres"),
        password2: Yup.string()
            .required("Repetir la contraseña es obligatoria")
            .oneOf([Yup.ref("password"), null], "Las contraseñas deben coincidir"),
    }),

    // Agrega esquemas para los pasos restantes...
};

const Registro = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [successModalOpen, setSuccessModalOpen] = useState(false); // Nuevo estado para el modal
    const isLastStep = activeStep === steps.length - 1;
    const navigate = useNavigate();
    const { signup } = useAuth();

    const handleNext = (values, formikBag) => {
        const currentSchema = validationSchemas[activeStep];
        currentSchema.validate(values, { abortEarly: false }).then(() => {
            setActiveStep((prev) => prev + 1);
            formikBag.setTouched({});
        });
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleModalClose = () => {
        setSuccessModalOpen(false);
        navigate("/login");
    };

    const handleSubmit = async (values, actions) => {
        try {
            setLoading(true);

            if (isLastStep) {
                if (values.nivel === "Otro") {
                    values.nivel = values.nivel_otro;
                }

                const result = await signup(values.email, values.password);
                const newUser = {
                    ...values,
                    fecha_nacimiento: values.fecha_nacimiento.toDate(),
                };
                newUser.uid = result.user.uid;
                console.log(newUser);
                await agregarUser(newUser);

                // Mostrar el modal de éxito
                setSuccessModalOpen(true);

                actions.resetForm();
            } else {
                handleNext(values, actions);
                actions.setSubmitting(false);
            }
        } catch (error) {
            if (error.message === "Firebase: Error (auth/email-already-in-use).") {
                toast.error("Hubo un error al enviar el formulario" + "ya existe un usuario con el correo ingresado.");
            } else {
                toast.error("Hubo un error al enviar el formulario" + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // Puedes crear componentes similares para otros tipos de campos si es necesario.

    return (
        <div className="background-registro ">
            <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Dialog open={successModalOpen} onClose={handleModalClose}>
                <DialogTitle>Registro Exitoso</DialogTitle>
                <DialogContent>
                    <p>Tu usuario se generó con éxito. Te enviamos un correo de verificación para confirmar tu cuenta.</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleModalClose} variant="contained" color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
            <ToastContainer autoClose={2000} />
            <div className="container ">
                <h1 className="text-center h2 mb-5 mt-5">Datos de Registro</h1>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </div>

            <Formik
                initialValues={{
                    nombre_completo: "",
                    DNI: "",
                    fecha_nacimiento: null,
                    pais: defaultCountry.value,
                    provincia: defaultState.value,
                    localidad: "",
                    codigo_postal: "",
                    calle: "",
                    numero: "",
                    dept: "",
                    piso: "",
                    telefono: "",
                    email: "",
                    nivel: "Estudiante de Enfermeria",
                    nivel_otro: "",
                    institucion: "",
                    puesto: "",
                    password: "",
                    password2: "",
                }}
                // validationSchema={validationSchema}
                validationSchema={validationSchemas[activeStep]}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="container d-flex flex-column align-items-center ">
                        {activeStep === 0 && <DatosPersonales />}
                        {activeStep === 1 && <DatosContacto />}
                        {activeStep === 2 && <DatosNivelDeFormacion />}
                        {activeStep === 3 && <DatosAntecedentes />}
                        {activeStep === 4 && <DatosRegistro />}
                        <Box className="mt-3">
                            <Button className="m-2 " disabled={activeStep === 0} onClick={handleBack} variant="contained" color="primary">
                                Atrás
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                variant="contained"
                                color="primary"
                                className="boton"
                                onClick={handleNext}
                            >
                                {isLastStep ? "Enviar" : "Siguiente"}
                            </Button>
                        </Box>
                    </Form>
                )}
            </Formik>
        </div>
    );
};
export default Registro;

const DatosPersonales = () => {
    const { values, setFieldValue } = useFormikContext();
    const [provincias, setProvincias] = useState([]);
    useEffect(() => {
        if (values.pais) {
            // Suponiendo que `getStates` devuelve un array de provincias basado en el código del país
            const estados = getStates(values.pais);
            setProvincias(estados);
            // Opcional: Establecer una provincia por defecto (puede ser la primera provincia, por ejemplo)
            setFieldValue("provincia", estados[0]?.value);
        }
    }, [values.pais, setFieldValue]);
    return (
        <Box className="mt-4 col-12 col-md-4 d-flex flex-wrap ">
            <FormikTextField className="m-2  col-12" name="nombre_completo" label="Nombre Completo" />
            <FormikTextField className="m-2  col-12" name="DNI" label="DNI" />
            <FormikDatePicker className="m-2  col-12" name="fecha_nacimiento" label="Fecha de Nacimiento" type="date" />
            <FormikSelectField className="m-2  col-12" name="pais" label="Pais" type="select" options={countries} />
            <FormikSelectField className="m-2  col-12" name="provincia" label="Provincia/Estado" type="select" options={provincias} />
        </Box>
    );
};

const DatosContacto = () => {
    return (
        <Box className="mt-5 col-12 col-md-4  d-flex flex-wrap justify-content-between">
            <FormikTextField className="m-2 col-md-7 col-12" name="localidad" label="Localidad" />
            <FormikTextField className="m-2 col-md-3 col-12" name="codigo_postal" label="CP" />
            <FormikTextField className="m-2 col-md-7 col-12" name="calle" label="Calle" />
            <FormikTextField className="m-2 col-md-3 col-4" name="numero" label="Número" />
            <FormikTextField className="mt-2 col-md-3 col-3" name="depto" label="Depto*" />
            <FormikTextField className="mt-2 col-md-3 col-3" name="piso" label="Piso*" />
            <FormikTextField className="mt-2 col-md-5 col-12" name="telefono" label="Télefono" />
        </Box>
    );
};

const DatosNivelDeFormacion = () => {
    const { values } = useFormikContext();

    return (
        <Box className="mt-5 col-10  col-md-7  d-flex  flex-column ms-md-auto ">
            <FormikRadioButton className="m-2" name="nivel" value="Estudiante de Enfermeria" label="Estudiante de Enfermeria" />
            <FormikRadioButton className="m-2 " name="nivel" value="Enfermero" label="Enfermero/a" />
            <FormikRadioButton className="m-2 " name="nivel" value="Licenciado en Enfermeria" label="Licenciado en Enfermeria" />
            <FormikRadioButton className="m-2 " name="nivel" value="Magister en Enfermeria" label="Magister en Enfermeria" />
            <FormikRadioButton className="m-2 " name="nivel" value="Doctorado en Enfermeria" label="Doctorado en Enfermeria" />
            <div className="d-flex flex-wrap">
                <FormikRadioButton className="m-2 " value="Otro" name="nivel" label="Otro" />
                {values.nivel === "Otro" && <FormikTextField className="" name="nivel_otro" label="Especifique Otro" />}
            </div>
        </Box>
    );
};

const DatosAntecedentes = () => {
    return (
        <Box className="mt-4 col-12 col-md-4 d-flex flex-wrap ">
            <FormikTextField className="m-2  col-12" name="institucion" label="Institución perteneciente" />
            <FormikTextField className="m-2  col-12" name="puesto" label="Puesto que ocupa en la institución" />
        </Box>
    );
};

const DatosRegistro = () => {
    return (
        <Box className="mt-4 col-12 col-md-4 d-flex flex-wrap ">
            <FormikTextField className="m-2  col-12" name="email" label="Email" type="email" />
            <FormikTextField className="m-2  col-12" type="password" name="password" label="Password" />
            <FormikTextField className="m-2  col-12" type="password" name="password2" label="Repetir password" />
        </Box>
    );
};
