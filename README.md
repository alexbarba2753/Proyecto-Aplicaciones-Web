# Backend - Proyecto Aplicaciones Web

## Resumen

Este es el servidor backend del proyecto. Está desarrollado con Node.js, Express y MongoDB, y ofrece las rutas y lógica necesarias para la gestión de usuarios, autenticación, correo electrónico y otras operaciones de la API.

## Stack principal

- Node.js
- Express 5
- MongoDB con Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- Nodemailer
- Socket.IO
- Stripe
- Cloudinary
- dotenv
- CORS
- express-fileupload
- fs-extra

## Estructura principal

- `src/index.js` - Punto de entrada del servidor
- `src/server.js` - Configuración de Express, middlewares y rutas
- `src/database.js` - Conexión a MongoDB
- `src/config/nodemailer.js` - Configuración de envío de correos
- `src/controllers/usuario_controller.js` - Lógica de controladores de usuario
- `src/helpers/sendMail.js` - Helper para enviar emails
- `src/middlewares/JWT.js` - Middleware de autenticación JWT
- `src/models/Usuario.js` - Modelo de usuario con Mongoose
- `src/routers/user_routes.js` - Rutas de usuario y endpoints API

## Scripts disponibles

- `npm start` - Inicia el servidor usando `node src/index.js`
- `npm run dev` - Inicia el servidor en modo vigilancia con `node --watch src/index.js`

## Configuración requerida

Crea un archivo `.env` en la carpeta `backend` con al menos las siguientes variables:

```env
PORT=3000
MONGODB_URI_LOCAL=mongodb://localhost:27017/tu_base_datos
JWT_SECRET=tu_clave_secreta
HOST_MAILTRAP=smtp.gmail.com
PORT_MAILTRAP=587
USER_MAILTRAP=tu_usuario@gmail.com
PASS_MAILTRAP=tu_contraseña
```

> Ajusta las variables de correo según tu proveedor si no usas Gmail.

## Uso básico

1. Instala las dependencias:
   ```bash
   cd backend
   npm install
   ```
2. Configura el archivo `.env`
3. Inicia el servidor:
   ```bash
   npm run dev
   ```
4. Abre `http://localhost:3000`

## Notas

- La API actualmente expone una ruta raíz `GET /` que devuelve `Server on`.
- Las rutas del usuario se registran bajo `/api`.
- Cualquier ruta no encontrada devuelve un error 404 con el mensaje `Endpoint no encontrado - 404`.
