import { Router } from 'express'
import { obtenerMensajes } from '../controllers/mensaje_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'

const router = Router()

// ═══════════════════════════════════════════════════════
// RUTAS DEL MÓDULO DE MENSAJES (Chat en Tiempo Real)
// El envío de mensajes se maneja por Socket.io,
// esta ruta REST solo sirve para obtener el historial.
// ═══════════════════════════════════════════════════════

// GET /api/aulas/:aulaId/mensajes → Historial de mensajes de un aula (paginado)
// Query params: ?page=1&limit=50
router.get('/aulas/:aulaId/mensajes', verificarTokenJWT, obtenerMensajes)

export default router
