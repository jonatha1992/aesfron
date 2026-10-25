# 04 — Diagramas funcionales

Los siguientes flujos son **[Inferido]** a partir de las capacidades descritas en `README.md`; no son una especificación confirmada de pantallas, servicios ni estados. Revisar el código antes de usarlos como contrato.

## Inscripción declarada

```mermaid
flowchart TD
    A[Usuario consulta catálogo] --> B[Selecciona un curso]
    B --> C[Solicita inscripción]
    C --> D{¿Se requiere pago?}
    D -->|Sí, según README| E[Flujo de pago MercadoPago]
    D -->|No / condición desconocida| F[Resultado de inscripción pendiente]
    E --> G[Resultado del pago y estado de inscripción pendientes]
```

## Componentes mencionados en README

```mermaid
flowchart LR
    U[Alumno o administrador] --> SPA[Aplicación web React + Vite]
    SPA --> AUTH[Firebase Auth, según README]
    SPA --> DB[Firestore, según README]
    SPA --> FILES[Firebase Storage, según README]
    SPA --> MP[MercadoPago para pagos, según README]
```

Las conexiones reflejan únicamente integraciones nombradas por el README. La arquitectura y la implementación de cada conexión quedan [Pendiente] de corroboración en el código.
