# AESFRON - Plataforma Educativa

Bienvenido al repositorio de la plataforma educativa de **AESFRON (Asociación de Enfermeros sin Fronteras)**. Esta aplicación web está diseñada para gestionar la formación, capacitación e inscripción de profesionales de enfermería en diversos cursos y programas.

## 🚀 Descripción del Proyecto

Este proyecto es una aplicación **Single Page Application (SPA)** construida con **React** y **Vite**, que ofrece una experiencia moderna y responsiva para la gestión educativa. Integra servicios de **Firebase** para autenticación, base de datos en tiempo real y almacenamiento, junto con pasarelas de pago para facilitar la inscripción a cursos.

### Características Principales

* **Gestión de Usuarios:**
  * Registro e inicio de sesión seguro.
  * Roles diferenciados: Administradores y Alumnos.
  * Gestión de perfiles de usuario.
* **Catálogo de Cursos:**
  * Visualización de cursos disponibles.
  * Detalle de unidades y contenido educativo.
* **Sistema de Inscripción:**
  * Flujo de inscripción a cursos.
  * Integración con **MercadoPago** para pagos en línea.
* **Panel de Control (Dashboard):**
  * Vista personalizada para alumnos ("Mis Cursos").
  * Panel de administración para gestión de contenido.
* **Seguridad:**
  * Rutas protegidas basadas en autenticación.
  * Manejo de sesiones con Firebase Auth.

## 🛠️ Tecnologías Utilizadas

Este proyecto utiliza un stack moderno de desarrollo web:

* **Core:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
* **Estilos y UI:**
  * [Bootstrap 5](https://getbootstrap.com/) & [React-Bootstrap](https://react-bootstrap.github.io/)
  * [Material UI (MUI)](https://mui.com/)
  * [Framer Motion](https://www.framer.com/motion/) (Animaciones)
  * [React Icons](https://react-icons.github.io/react-icons/)
* **Backend & Servicios (Serverless):**
  * [Firebase Auth](https://firebase.google.com/docs/auth) (Autenticación)
  * [Firestore](https://firebase.google.com/docs/firestore) (Base de datos NoSQL)
  * [Firebase Storage](https://firebase.google.com/docs/storage) (Almacenamiento de archivos)
* **Gestión de Formularios:**
  * [Formik](https://formik.org/) + [Yup](https://github.com/jquense/yup) (Validación)
* **Utilidades:**
  * [React Router DOM](https://reactrouter.com/) (Navegación)
  * [Axios](https://axios-http.com/) (Peticiones HTTP)
  * [Day.js](https://day.js.org/) / [Moment.js](https://momentjs.com/) (Manejo de fechas)
  * [EmailJS](https://www.emailjs.com/) (Envío de correos)

## 📋 Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu entorno de desarrollo:

* [Node.js](https://nodejs.org/) (versión 16 o superior recomendada)
* [npm](https://www.npmjs.com/) (generalmente incluido con Node.js)

## ⚙️ Instalación y Configuración

Sigue estos pasos para configurar el proyecto localmente:

1. **Clonar el repositorio:**

    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd aesfron
    ```

2. **Instalar dependencias:**

    ```bash
    npm install
    ```

3. **Configuración de Variables de Entorno:**

    El proyecto utiliza Firebase. Asegúrate de configurar correctamente `src/firebase.js` con tus credenciales o, idealmente, migrar estas claves a un archivo `.env` en la raíz del proyecto para mayor seguridad.

    Ejemplo de archivo `.env` (si se implementa):

    ```env
    VITE_API_KEY=tu_api_key
    VITE_AUTH_DOMAIN=tu_auth_domain
    VITE_PROJECT_ID=tu_project_id
    ...
    ```

4. **Ejecutar el servidor de desarrollo:**

    ```bash
    npm run dev
    ```

    La aplicación estará disponible en `http://localhost:5173`.

## 📦 Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:

* `npm run dev`: Inicia el servidor de desarrollo.
* `npm run build`: Construye la aplicación para producción en la carpeta `dist`.
* `npm run preview`: Sirve la versión de producción localmente para pruebas.
* `npm run lint`: Ejecuta el linter (ESLint) para analizar el código.

## 📂 Estructura del Proyecto

```
aesfron/
├── public/          # Archivos estáticos
├── src/
│   ├── assets/      # Imágenes y recursos multimedia
│   ├── components/  # Componentes reutilizables de React
│   ├── context/     # Contexto de la aplicación (AuthContext, etc.)
│   ├── controllers/ # Lógica de control y gestión de datos
│   ├── css/         # Estilos globales y específicos
│   ├── pages/       # Vistas principales de la aplicación
│   ├── security/    # Utilidades de seguridad
│   ├── App.jsx      # Componente raíz y configuración de rutas
│   ├── firebase.js  # Configuración e inicialización de Firebase
│   └── main.jsx     # Punto de entrada de la aplicación
├── .eslintrc.cjs    # Configuración de ESLint
├── firebase.json    # Configuración de despliegue en Firebase
└── vite.config.js   # Configuración de Vite
```

## 🤝 Contribución

1. Haz un Fork del proyecto.
2. Crea tu rama de funcionalidad (`git checkout -b feature/NuevaCaracteristica`).
3. Haz Commit de tus cambios (`git commit -m 'Agrega algua NuevaCaracteristica'`).
4. Haz Push a la rama (`git push origin feature/NuevaCaracteristica`).
5. Abre un Pull Request.

---
Desarrollado para **AESFRON**.
