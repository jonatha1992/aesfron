import { useRef } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Redes } from "../components/Redes.jsx";
import { validarNumeroTelefono } from "../security/Validacion.js";
import "../css/contact.css";
import * as Yup from "yup";
import emailjs from "@emailjs/browser";
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
    name: Yup.string().required("El nombre es obligatorio"),
    telephone: Yup.string()
        .required("El número es obligatorio")
        .test("valido", "Número de teléfono no válido", (value) => validarNumeroTelefono(value)),
    email: Yup.string().email("El correo no es válido").required("El correo es obligatorio"),
    message: Yup.string().required("El mensaje es obligatorio"),
});

const Contact = () => {
    const formRef = useRef();

    const handleSubmit = async (values, { setSubmitting, resetForm, setErrors }) => {
        setErrors({});
        const phoneNumber = `${values.country}${values.telephone}`;
        try {
            // Enviar correo al destinatario principal
            await emailjs.send(
                "service_cg53wui",
                "template_3a2716m",
                {
                    to_email: "aesfronsecretaria@gmail.com",
                    from_name: "Tecnofusión.IT",
                    subject: "Nuevo mensaje de " + values.name,
                    name: values.name,
                    message: `${values.message}`,
                    email: values.email,
                    telephone: phoneNumber,
                },
                "qHtG6A2I87n7CARUF"
            );

            // Enviar correo de confirmación al remitente
            await emailjs.send(
                "service_cg53wui",
                "template_3mvc41r",
                {
                    to_email: values.email,
                    from_name: "AESFRON",
                    subject: "Confirmación de envío de mensaje",
                    name: values.name,
                },
                "qHtG6A2I87n7CARUF"
            );

            toast.success("¡La consulta se ha enviado con éxito!");
            resetForm();
        } catch (error) {
            toast.error("¡Hubo un error al enviar la consulta!");
        }

        setSubmitting(false);
    };

    return (
        <>
            <div className="container-footer">
                <div className="container">
                    <div className="row row-footer ">
                        <ToastContainer
                            autoClose={2000}
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
                                    name: "",
                                    telephone: "",
                                    email: "",
                                    message: "",
                                    country: defaultCountryValue,
                                }}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                                validateOnSubmit={true}
                                validateOnChange={false}
                                validateOnBlur={false}
                                enableReinitialize={true}
                            >
                                {({ errors, touched, values }) => (
                                    <Form className=" col-lg-9 col-sm-12  fs-6 " ref={formRef}>
                                        <h1 className="text-center h1 mb-2 text-white ">Contacto</h1>
                                        <div className="form-floating mb-3  ">
                                            <Field type="text" className="form-control" placeholder="Enter your name" name="name" />
                                            <label>Nombre Completo</label>
                                            <ErrorMessage name="name" component="div" className="text-danger" />
                                        </div>
                                        <div className="d-flex justify-content-between mb-3 ">
                                            <div className="form-floating col-4 ">
                                                <Field as="select" name="country" className="form-select">
                                                    {countries.map((country, index) => (
                                                        <option key={index} value={country.value}>
                                                            {country.label}
                                                        </option>
                                                    ))}
                                                </Field>
                                                <label htmlFor="country">Codigo</label>
                                            </div>
                                            <div className="form-floating col-7">
                                                <Field
                                                    type="tel"
                                                    className="form-control"
                                                    placeholder="Ingresa tu teléfono"
                                                    name="telephone"
                                                />
                                                <label htmlFor="telefono">Número sin prefijo</label>
                                                <ErrorMessage name="telephone" component="div" className="text-danger" />
                                            </div>
                                        </div>
                                        <div className="form-floating mb-3">
                                            <Field type="text" className="form-control" name="email" placeholder="Ingrese your email" />
                                            <label>Email</label>
                                            <ErrorMessage name="email" component="div" className="text-danger" />
                                        </div>
                                        <div className="form-floating mb-3">
                                            <Field
                                                as="textarea"
                                                className="form-control"
                                                placeholder="Ingrese el mensaje"
                                                name="message"
                                                style={{ height: "100px" }}
                                            />
                                            <label>Mensaje</label>
                                            <ErrorMessage name="message" component="div" className="text-danger" />
                                        </div>

                                        <button className="btn btn-primary fw-bold text-uppercase btn-block w-100 mb-1" type="submit">
                                            Enviar
                                        </button>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                        <div className="col-md-6 d-flex justify-content-center mt-5" style={{ flexDirection: "column" }}>
                            <Redes />
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-wrap mt-5 text-white text-center justify-content-center">
                    <p> Desarrollado por </p>
                    <a
                        href="https://tecnofusion.it"
                        style={{
                            letterSpacing: "2px",
                            fontWeight: "bolder",
                            paddingLeft: "2px",
                            paddingRight: "2px",
                        }}
                    >
                        TecnoFusion.IT
                    </a>
                    <p>© 2024 </p>
                </div>
            </div>
        </>
    );
};

export default Contact;
