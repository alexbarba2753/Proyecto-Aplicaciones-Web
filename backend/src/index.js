import { createServer } from 'http'
import app from './server.js'
import connection from './database.js'
import { initSocketIO } from './config/socketio.js'

// Conectar a MongoDB
connection()

// ═══════════════════════════════════════════════════════
// SERVIDOR HTTP + SOCKET.IO
// Creamos un servidor HTTP nativo que envuelve a Express
// para que Socket.io pueda montarse sobre el mismo puerto.
// Esto permite que REST y WebSockets convivan en localhost:3000.
// ═══════════════════════════════════════════════════════

const httpServer = createServer(app)

// Inicializar Socket.io sobre el servidor HTTP
initSocketIO(httpServer)

// Arrancar el servidor en el puerto configurado
httpServer.listen(app.get('port'), () => {
    console.log(`Server ok on http://localhost:${app.get('port')}`)
})