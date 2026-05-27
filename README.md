# Frontend - Proyecto Aplicaciones Web

## Resumen

Este es el cliente web desarrollado con React y Vite. Está diseñado para integrarse con el backend del proyecto y ofrece una interfaz para registro, inicio de sesión, recuperación de contraseña y flujo de confirmación.

## Stack principal

- Vite
- React 18
- Tailwind CSS
- React Router Dom
- React Hook Form
- Axios
- Zustand
- React Toastify
- Stripe
- Socket.IO Client

## Estructura principal

- `src/main.jsx` - Punto de entrada de la aplicación
- `src/App.jsx` - Componente raíz
- `src/index.css` / `src/App.css` - Estilos globales
- `src/context/storeAuth.jsx` - Estado de autenticación con Zustand
- `src/hooks/useFetch.js` - Hook personalizado para peticiones
- `src/layout/Dashboard.jsx` - Layout principal de usuario
- `src/pages/` - Vistas principales:
  - `Home.jsx`
  - `Login.jsx`
  - `Register.jsx`
  - `Forgot.jsx`
  - `Reset.jsx`
  - `Confirm.jsx`
- `src/routes/ProtectedRoute.jsx` - Ruta protegida para usuarios autenticados
- `src/routes/PublicRoute.jsx` - Ruta pública para visitantes

## Scripts disponibles

- `npm run dev` - Inicia el servidor de desarrollo de Vite
- `npm run build` - Genera la versión de producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta ESLint en todo el proyecto

## Instalación y ejecución

1. Instala las dependencias:
   ```bash
   cd frontend/vite-project
   npm install
   ```
2. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
3. Abre el navegador en la URL que muestre Vite (usualmente `http://localhost:5173`).

## Conexión con el backend

- Esta aplicación espera una API backend funcionando que provea autenticación y endpoints de usuario.
- Ajusta las URL de API en los llamados de `axios` según tu entorno local o de producción.

## Notas

- La aplicación usa Stripe para pagos y Stripe Elements en el frontend.
- Tailwind CSS está configurado a través de `@tailwindcss/vite`.
- El proyecto ya incluye rutas públicas y protegidas, además de manejo de formularios con validación.
