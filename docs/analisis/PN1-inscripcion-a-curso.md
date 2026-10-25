# PN1 — Inscripción a un curso

> **Estado:** [Inferido] Caso candidato derivado de `README.md`, sección «Sistema de Inscripción». El flujo real requiere validación en el código.

## Actor principal

Alumno / usuario que desea inscribirse. La equivalencia con el rol alumno es [Inferido].

## Precondiciones

- El usuario puede consultar un curso del catálogo. [Inferido]
- [Pendiente] No está confirmado si se exige iniciar sesión antes de comenzar.
- [Pendiente] Deben conocerse las condiciones de inscripción y disponibilidad del curso.

## Flujo principal (propuesto, no verificado)

1. El usuario consulta los cursos disponibles.
2. El usuario selecciona un curso.
3. El usuario inicia la solicitud de inscripción.
4. Si corresponde, realiza el pago mediante MercadoPago, integración mencionada por el README.
5. El sistema informa el resultado de la operación. [Pendiente] El README no describe confirmación, persistencia ni estados.

## Alternativas y excepciones

- [Pendiente] El pago es rechazado, cancelado o queda pendiente.
- [Pendiente] El curso no admite nuevas inscripciones o el usuario ya está inscripto.
- [Pendiente] Error de autenticación, conectividad o proveedor de pago.

## Postcondición

[Pendiente] El README no define cuándo una inscripción se considera confirmada ni dónde se visualiza su estado.

## Fuente

`README.md`, secciones «Catálogo de Cursos» y «Sistema de Inscripción».
