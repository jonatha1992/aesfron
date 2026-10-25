# Análisis funcional de AESFRON

Este directorio registra el alcance funcional de la plataforma a partir del `README.md` y del código presente en el repositorio. El README describe capacidades previstas; no se consideran verificadas hasta corroborarlas en la implementación. Lo no confirmado se marca como `[Inferido]` o `[Pendiente]`.

## Orden de lectura

| Documento | Contenido |
|---|---|
| [00-descripcion-global.md](00-descripcion-global.md) | Propósito y alcance |
| [01-actores-y-roles.md](01-actores-y-roles.md) | Actores mencionados y evidencia |
| [02-requerimientos.md](02-requerimientos.md) | Requerimientos funcionales y no funcionales |
| [03-reglas-de-negocio.md](03-reglas-de-negocio.md) | Reglas confirmadas y pendientes |
| [04-diagramas.md](04-diagramas.md) | Flujos funcionales inferidos |
| [05-limites-del-sistema.md](05-limites-del-sistema.md) | Límites y reglas para agentes |
| [PN1-inscripcion-a-curso.md](PN1-inscripcion-a-curso.md) | Caso de uso de inscripción |

## Criterio de evidencia

- `README.md`: describe la plataforma como una SPA educativa para gestionar formación, cursos e inscripciones; menciona usuarios, roles, catálogo, dashboard, Firebase y MercadoPago.
- El código fuente debe verificarse para determinar qué capacidades están implementadas actualmente. La descripción detallada que no pueda confirmarse queda marcada `[Pendiente]` o `[Inferido]`.
