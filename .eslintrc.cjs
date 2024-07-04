/* eslint-env node */

module.exports = {
    env: { browser: true, es2020: true },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:react-hooks/recommended",
        "plugin:import/errors", // Añadido para manejar errores de importación
        "plugin:import/warnings", // Añadido para manejar advertencias de importación
    ],
    parserOptions: { ecmaVersion: "latest", sourceType: "module" },
    settings: { react: { version: "18.2" } },
    plugins: ["react-refresh", "import"], // Añadido 'import'
    rules: {
        "import/no-unresolved": ["error", { ignore: ["^https?://"] }], // Ignorar URLs
        "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
        "import/named": "error", // Añadido para verificar que los nombres importados coincidan con los exportados
        "import/default": "error", // Añadido para verificar las importaciones predeterminadas
        "import/namespace": "error", // Añadido para verificar las importaciones de namespace
        "react/prop-types": "off", // Desactiva la advertencia sobre prop-types
    },
};
