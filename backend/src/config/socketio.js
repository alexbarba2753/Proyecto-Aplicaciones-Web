import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import Mensaje from '../models/Mensaje.js'
import Aula from '../models/Aula.js'
import Usuario from '../models/Usuario.js'

/**
 * CONFIGURACIÓN DE SOCKET.IO
 * 
 * Integra comunicación en tiempo real sobre el servidor HTTP de Express.
 * Funcionalidades:
 * - Autenticación JWT en el handshake (misma seguridad que las rutas REST)
 * - Salas (rooms) basadas en el ID del aula virtual
 * - Persistencia de mensajes en MongoDB
 * - Broadcasting de mensajes a todos los miembros del aula
 * 
 * @param {http.Server} httpServer - El servidor HTTP creado con http.createServer(app)
 * @returns {Server} - La instancia de Socket.io
 */
const initSocketIO = (httpServer) => {

    // Crear instancia de Socket.io con CORS habilitado para el frontend
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.URL_FRONTEND?.replace(/\/$/, '') || 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true
        }
    })


    // ═══════════════════════════════════════════════════════
    // MIDDLEWARE DE AUTENTICACIÓN
    // Verifica el JWT antes de permitir la conexión WebSocket.
    // El token se envía desde el cliente en socket.handshake.auth.token
    // ═══════════════════════════════════════════════════════

    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth?.token

            if (!token) {
                return next(new Error('Autenticación requerida: token no proporcionado'))
            }

            // Verificamos el JWT con la misma clave secreta que usa el middleware REST
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // Buscamos al usuario en la BDD para validar que aún existe
            const usuario = await Usuario.findById(decoded.id)
                .select('nombre apellido email rol')
                .lean()

            if (!usuario) {
                return next(new Error('Usuario no encontrado'))
            }

            // Inyectamos los datos del usuario en el socket para usarlos en los eventos
            socket.usuario = {
                _id: usuario._id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                rol: usuario.rol
            }

            next()

        } catch (error) {
            console.error('❌ Error de autenticación en Socket.io:', error.message)
            next(new Error('Token inválido o expirado'))
        }
    })


    // ═══════════════════════════════════════════════════════
    // MANEJO DE CONEXIONES Y EVENTOS
    // ═══════════════════════════════════════════════════════

    io.on('connection', (socket) => {
        console.log(`🔌 Usuario conectado: ${socket.usuario.nombre} ${socket.usuario.apellido} (${socket.id})`)


        /**
         * EVENTO: unirse-aula
         * 
         * El cliente envía el ID del aula a la que quiere unirse.
         * Validamos que el usuario pertenezca al aula (como docente o estudiante)
         * antes de permitirle unirse a la room de Socket.io.
         * 
         * @param {string} aulaId - El ObjectId del aula
         * @param {function} callback - Función de confirmación al cliente
         */
        socket.on('unirse-aula', async (aulaId, callback) => {
            try {
                // Verificar que el aula existe y que el usuario pertenece a ella
                const aula = await Aula.findById(aulaId).lean()

                if (!aula) {
                    return callback?.({ error: 'Aula no encontrada' })
                }

                const esDocente = aula.docente.toString() === socket.usuario._id.toString()
                const esEstudiante = aula.estudiantes.some(
                    estId => estId.toString() === socket.usuario._id.toString()
                )

                if (!esDocente && !esEstudiante) {
                    return callback?.({ error: 'No tienes acceso a esta aula' })
                }

                // Unirse a la room de Socket.io (identificada por el ID del aula)
                socket.join(aulaId)
                console.log(`📚 ${socket.usuario.nombre} se unió a la sala: ${aulaId}`)

                callback?.({ ok: true, msg: `Te has unido al chat del aula "${aula.nombre}"` })

            } catch (error) {
                console.error('❌ Error al unirse al aula:', error.message)
                callback?.({ error: 'Error al unirse al aula' })
            }
        })


        /**
         * EVENTO: enviar-mensaje
         * 
         * El cliente envía un mensaje a un aula específica.
         * El mensaje se persiste en MongoDB y se transmite a todos
         * los miembros conectados a la room del aula.
         * 
         * @param {object} data - { aulaId: string, contenido: string }
         * @param {function} callback - Confirmación al emisor
         */
        socket.on('enviar-mensaje', async (data, callback) => {
            try {
                const { aulaId, contenido } = data

                // Validaciones básicas
                if (!aulaId || !contenido || contenido.trim() === '') {
                    return callback?.({ error: 'El aula y el contenido son obligatorios' })
                }

                if (contenido.length > 1000) {
                    return callback?.({ error: 'El mensaje no puede superar los 1000 caracteres' })
                }

                // Verificar que el socket está en la room del aula
                if (!socket.rooms.has(aulaId)) {
                    return callback?.({ error: 'Primero debes unirte al aula' })
                }

                // Persistir el mensaje en MongoDB
                const nuevoMensaje = await Mensaje.create({
                    remitente: socket.usuario._id,
                    aula: aulaId,
                    contenido: contenido.trim()
                })

                // Preparar el mensaje para broadcast (con datos del remitente)
                const mensajeParaEnviar = {
                    _id: nuevoMensaje._id,
                    contenido: nuevoMensaje.contenido,
                    timestamp: nuevoMensaje.timestamp,
                    remitente: {
                        _id: socket.usuario._id,
                        nombre: socket.usuario.nombre,
                        apellido: socket.usuario.apellido
                    },
                    aula: aulaId
                }

                // Emitir a TODOS los miembros de la room (incluido el emisor)
                io.to(aulaId).emit('nuevo-mensaje', mensajeParaEnviar)

                callback?.({ ok: true, mensaje: mensajeParaEnviar })

            } catch (error) {
                console.error('❌ Error al enviar mensaje:', error.message)
                callback?.({ error: 'Error al enviar el mensaje' })
            }
        })


        /**
         * EVENTO: disconnect
         * Limpieza cuando un usuario se desconecta
         */
        socket.on('disconnect', () => {
            console.log(`🔌 Usuario desconectado: ${socket.usuario.nombre} (${socket.id})`)
        })
    })


    console.log('🚀 Socket.io inicializado correctamente')
    return io
}


export { initSocketIO }
