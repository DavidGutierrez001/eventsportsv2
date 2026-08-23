# Ev.site

**Plataforma de eventos deportivos, culturales... etc: descubre, inscríbete y gestiona.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![pnpm](https://img.shields.io/badge/pnpm-11-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![License](https://img.shields.io/badge/license-MIT-green)]()


---

## Sobre el proyecto

Ev.site es una aplicación web construida con **Next.js (App Router)** que permite a los usuarios explorar eventos deportivos organizados por categoría, ver los detalles de cada evento e inscribirse en ellos. Incluye un panel de administración para la gestión completa de eventos (crear, editar, eliminar y subir imágenes).

El frontend consume una API REST externa para autenticación y gestión de eventos.

## Características

- Exploración de eventos agrupados por categoría (ciclismo, natación, maratón...)
- Detalle de cada evento en un diálogo interactivo
- Autenticación de usuarios (login y registro) con validación
- Inscripción y cancelación de inscripciones a eventos
- Panel de administración con CRUD completo de eventos
- Carga y eliminación de imágenes de eventos
- Modo claro / oscuro / sistema (con `next-themes`)
- Interfaz responsive construida con `shadcn/ui`
- Formularios validados con `react-hook-form` + `zod`

## Stack tecnológico

| Tecnología | Descripción |
| --- | --- |
| [Next.js 16](https://nextjs.org/) | Framework de React con App Router |
| [React 19](https://react.dev/) | Biblioteca de UI (con React Compiler) |
| [Tailwind CSS 4](https://tailwindcss.com/) | Estilos utilitarios |
| [shadcn/ui](https://ui.shadcn.com/) | Componentes accesibles y personalizables |
| [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | Manejo y validación de formularios |
| [lucide-react](https://lucide.dev/) | Iconografía |
| [pnpm](https://pnpm.io/) | Gestor de paquetes |

## Estructura del proyecto

```
src/
├── app/
│   ├── (main)/              # Página pública y detalle de eventos
│   │   └── eventos/[slug]/  # Página dinámica de evento
│   ├── dashboard/           # Panel de administración de eventos
│   ├── login/               # Página de inicio de sesión
│   ├── register/            # Página de registro
│   └── layout.jsx           # Layout raíz (temas, fuentes, providers)
├── components/
│   ├── ui/                  # Componentes base (shadcn/ui)
│   ├── EventCard.jsx        # Tarjeta de evento
│   ├── EventDetailDialog.jsx# Detalle del evento
│   ├── LoginForm.jsx        # Formulario de login
│   └── RegisterForm.jsx     # Formulario de registro
├── context/
│   ├── AuthContext.jsx      # Estado global de autenticación
│   └── ThemeContext.jsx     # Gestión del tema
├── services/
│   ├── api.js               # Cliente HTTP central (fetch)
│   ├── authService.js       # Endpoints de autenticación
│   └── eventsServices.js    # Endpoints de eventos e inscripciones
└── lib/                     # Utilidades (cn, iconos por categoría)
```

## Instalación

> Requiere [Node.js](https://nodejs.org/) 18+ y [pnpm](https://pnpm.io/).

```bash
# 1. Clona el repositorio
git clone https://github.com/tu-usuario/evsite.git
cd evsite

# 2. Instala las dependencias
pnpm install

# 3. Inicia el servidor de desarrollo
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `pnpm dev` | Inicia el servidor de desarrollo |
| `pnpm build` | Genera la build de producción |
| `pnpm start` | Sirve la build de producción |
| `pnpm lint` | Ejecuta ESLint |

## Configuración de la API

El cliente HTTP está centralizado en [`src/services/api.js`](src/services/api.js). Por defecto apunta a la API de producción:

```js
// Producción
const API_BASE_URL = "https://sistema-gestion-api-lqx3.onrender.com";

// Desarrollo local
const API_BASE_URL = "http://localhost:8000";
```

### Endpoints principales

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/auth/login` | Inicio de sesión |
| `POST` | `/auth/register` | Registro de usuario |
| `GET` | `/eventos` | Listar eventos |
| `GET` | `/eventos/:id` | Obtener un evento |
| `POST` / `PUT` / `DELETE` | `/eventos` | CRUD de eventos *(admin)* |
| `POST` | `/eventos/:id/inscribirse` | Inscribirse a un evento |
| `GET` | `/eventos/mis-inscripciones` | Mis inscripciones |

## Roadmap

- [ ] Búsqueda y filtros avanzados de eventos
- [ ] Perfil de usuario editable
- [ ] Notificaciones de próximos eventos
- [ ] Paginación de resultados

## 
Hecho con Next.js — © 2026 Ev.site

---
