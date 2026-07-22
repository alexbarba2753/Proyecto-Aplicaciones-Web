// Requerir módulos
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import session from 'express-session'
import passport from './config/passport.js'
import routerUser from './routers/user_routes.js'
import routerAulas from './routers/aula_routes.js'
import routerAuth from './routers/auth_routes.js'
import routerMensajes from './routers/mensaje_routes.js'

// Inicializaciones
const app = express()
dotenv.config()

// Configuraciones 


// Middlewares 
app.use(express.json())
app.use(cors())

// ═══════════════════════════════════════════════════════
// 🆕 PASSPORT.JS — Sesión y autenticación OAuth
// express-session es requerido por Passport para manejar el estado
// durante el flujo de redirección de OAuth 2.0 (Google)
// ═══════════════════════════════════════════════════════
app.use(session({
    secret: process.env.SESSION_SECRET || 'clave_secreta_temporal_esfot',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,      // En producción con HTTPS cambiar a true
        maxAge: 60000       // La sesión solo dura 1 minuto (solo para el flujo OAuth)
    }
}))

app.use(passport.initialize())
app.use(passport.session())


// Variables globales
app.set('port', process.env.PORT || 3000)

// Rutas 
app.get('/', (req, res) => res.send("Server on"))

// Rutas para usuarios
app.use('/api', routerUser)

// Rutas para aulas virtuales
app.use('/api', routerAulas)

// 🆕 Rutas para autenticación con Google OAuth
app.use('/api', routerAuth)

// 🆕 Rutas para mensajes del chat
app.use('/api', routerMensajes)

// Manejo de una ruta que no sea encontrada
app.use((req, res) => res.status(404).send("Endpoint no encontrado - 404"))


// Exportar la instancia de express por medio de app
export default app