/* eslint-disable react/prop-types */
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Error } from "../components/Error.jsx";
import { Redes } from "../components/Redes.jsx";
import { validarNumeroTelefono } from "../security/Validacion.js";
import "../css/contact.css"; // Asegúrate de tener un archivo CSS para estilos adicionales
import * as Yup from "yup";
import emailjs from "@emailjs/browser";
import { useRef } from "react";
import { countries as countriesList } from "countries-list";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Obtener la lista de países con sus prefijos telefónicos
const countries = Object.keys(countriesList).map((code) => ({
    label: `${countriesList[code].name} (+${countriesList[code].phone})`,
    value: `+${countriesList[code].phone}`,
}));

// Encuentra el valor que corresponde a Argentina (+54)
const defaultCountryValue = countries.find((country) => country.value === "+54")?.value || countries[0].value;

const validationSchema = Yup.object().shape({
    nombre: Yup.string().required("El nombre es obligatorio"),
    telefono: Yup.string()
        .required("El número es obligatorio")
        .test("valido", "Número de teléfono no válido", (value) => validarNumeroTelefono(value)),
    email: Yup.string().email("El correo no es válido").required("El correo es obligatorio"),
    mensaje: Yup.string().required("El mensaje es obligatorio"),
});

const Contact = () => {
    const formRef = useRef();

    const handleSubmit = async (values, { setSubmitting, resetForm, setErrors }) => {
        setErrors({});
        const phoneNumber = `${values.country}${values.telefono}`;
        try {
            let result = await emailjs.sendForm("service_cg53wui", "template_3a2716m", formRef.current, "qHtG6A2I87n7CARUF", {
                telefono: phoneNumber,
            });
            console.log(result.text);
            toast.success("¡La consulta se ha enviado con éxito!");
        } catch (error) {
            console.log(error.text);
            toast.error("¡Hubo un error al enviar la consulta!");
        }

        setSubmitting(true);
        resetForm();
    };

    return (
        <>
            <div className="container-footer">
                <div className="container">
                    <div className="row row-footer ">
                        <ToastContainer
                            autoClose={10000}
                            className="toast-container"
                            style={{
                                position: "relative",
                                top: "0",
                                zIndex: "9999",
                            }}
                        />
                        <div className="col-md-6  d-flex justify-content-center">
                            <Formik
                                initialValues={{
                                    nombre: "",
                                    telefono: "",
                                    email: "",
                                    mensaje: "",
                                    country: defaultCountryValue,
                                }}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                                validateOnSubmit={true}
                                validateOnChange={false}
                                validateOnBlur={false}
                            >
                                <Form className=" col-lg-9 col-sm-12  fs-6 " ref={formRef}>
                                    <h1 className="text-center h1 mb-2 text-white ">Contacto</h1>
                                    <div className="form-floating mb-3  ">
                                        <Field type="text" className="form-control " placeholder="Enter your name" name="nombre" />
                                        <label>Nombre Completo</label>
                                        <ErrorMessage name="nombre" component={(props) => <Error message={props.children} />} />
                                    </div>
                                    <div className="  d-flex justify-content-between mb-3 ">
                                        <div className="form-floating col-4 ">
                                            <Field as="select" name="country" className="form-select ">
                                                {countries.map((country, index) => (
                                                    <option key={index} value={country.value}>
                                                        {country.label}
                                                    </option>
                                                ))}
                                            </Field>
                                            <label htmlFor="country">Codigo</label>
                                        </div>
                                        <div className="form-floating col-7">
                                            <Field type="tel" className="form-control" placeholder="Ingresa tu teléfono" name="telefono" />
                                            <label htmlFor="telefono">Número sin prefijo</label>
                                            <ErrorMessage name="telefono" component={(props) => <Error message={props.children} />} />
                                        </div>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <Field type="text" className="form-control" name="email" placeholder="Ingrese your email" />
                                        <label>Email</label>
                                        <ErrorMessage name="email" component={(props) => <Error message={props.children} />} />
                                    </div>
                                    <div className="form-floating mb-3">
                                        <Field
                                            type="textarea"
                                            as="textarea"
                                            rows="3"
                                            name="mensaje"
                                            className="form-control"
                                            placeholder="Ingrese el mensaje"
                                        />
                                        <label>Mensaje</label>
                                        <ErrorMessage name="mensaje" component={(props) => <Error message={props.children} />} />
                                    </div>

                                    <button className="btn btn-primary fw-bold text-uppercase btn-block w-100 mb-1" type="submit">
                                        Enviar
                                    </button>
                                </Form>
                            </Formik>
                        </div>
                        <div className="col-md-6 d-flex justify-content-center mt-5" style={{ flexDirection: "column" }}>
                            <Redes />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Contact;
