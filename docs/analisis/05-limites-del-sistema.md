# 05 — Límites del sistema

## Qué NO hace (con la evidencia disponible)

- No se puede afirmar que implemente certificados, evaluaciones, asistencia, reportes o notificaciones: el README revisado no los describe. Esto no demuestra su ausencia en el código.
- No se especifican reglas de inscripción, reembolsos, cancelaciones ni estados de pago.
- No se especifican permisos concretos por rol ni funcionalidades disponibles sin autenticación.
- No se documentan niveles de servicio, requisitos de rendimiento ni normas de cumplimiento.
- No se debe inferir que todos los servicios listados en el README estén configurados o desplegados actualmente.

## Límites técnicos/documentales

- La configuración de Firebase se ubica en `src/firebase.js` según el README, que recomienda migrar las credenciales a variables de entorno. No exponer ni copiar secretos al documentar.
- El README contiene un marcador de ejemplo `<URL_DEL_REPOSITORIO>` y un ejemplo de `.env` hipotético; no son valores de configuración confirmados.
- [Pendiente] Verificar en el código la autenticación, persistencia de cursos, almacenamiento, pagos, rutas y controles de acceso.

## Reglas para agentes

1. Consultar este paquete antes de modificar comportamiento; leer también `AGENTS.md`.
2. Tratar las capacidades del README como declaraciones, no como prueba de implementación.
3. Mantener `[Inferido]` y `[Pendiente]` hasta confirmarlas con fuentes del repositorio o con el usuario.
4. No agregar reglas de negocio, integraciones ni requisitos no respaldados; si el código contradice este análisis, documentar la discrepancia antes de cambiar el comportamiento.
