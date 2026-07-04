// Requerir módulos
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import routerUser from './routers/user_routes.js'
import routerAulas from './routers/aula_routes.js'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './swagger.js'
// Inicializaciones
const app = express()
dotenv.config()

// Configuraciones 


// Middlewares 
app.use(express.json())
app.use(cors())


// Variables globales
app.set('port',process.env.PORT || 3000)

// Rutas 
app.get('/',(req,res)=> res.send("Server on"))

// Rutas para usuarios
app.use('/api',routerUser)

<<<<<<< HEAD
// Esto hará que la documentación sea accesible en la raíz del backend /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Rutas para aulas virtuales
app.use('/api',routerAulas)

// Manejo de una ruta que no sea encontrada
app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))


// Exportar la instancia de express por medio de app
export default  app