# KOS Dashboard

Dashboard local para visualizar el estado del [kos-framework](https://github.com/kcumen/kos-framework).

## Stack

- **Frontend:** React 19 + Vite
- **Backend:** Express.js
- **Markdown:** react-markdown + remark-gfm
- **Tema:** Dark theme estilo Discord

## Vistas

| Vista | Descripción |
|-------|-------------|
| **Products** | Productos registrados en el framework |
| **Backlog** | Kanban con tareas (todo / doing / done) |
| **Plans** | Planes de ingeniería por producto |
| **Inbox** | Ideas capturadas pendientes de procesar |

## Quick Start

```bash
npm install
npm run build
node server/index.js
```

Abrir [http://localhost:3001](http://localhost:3001)

## Desarrollo

```bash
npm install
npm run dev      # Vite dev server
node server/index.js  # API + static en puerto 3001
```

## Estructura

```
kos-dashboard/
├── server/
│   └── index.js       # Express API + static server
├── src/
│   ├── views/         # ProductsView, BacklogView, PlansView, InboxView
│   └── components/    # Sidebar, Modal, MarkdownContent
└── dist/              # Build de producción
```

## Datos

El dashboard lee directamente del filesystem de kos-framework en `/home/Kcumen/kos-framework/`. No tiene base de datos propia.
