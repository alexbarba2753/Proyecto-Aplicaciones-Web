import { Router } from 'express'
import { 
    crearAula, 
    listarAulas, 
    obtenerAula, 
    actualizarAula, 
    archivarAula, 
    unirseAula 
} from '../controllers/aula_controller.js'
import { verificarTokenJWT, verificarRol } from '../middlewares/JWT.js'

const router = Router()

// ═══════════════════════════════════════════════════════════════
// RUTAS PROTEGIDAS DEL MÓDULO DE AULAS VIRTUALES
// Todas requieren autenticación JWT como mínimo
// ═══════════════════════════════════════════════════════════════

// POST /api/aulas → Crear aula (Solo Docente)
router.post('/aulas', verificarTokenJWT, verificarRol('docente'), crearAula)

// GET /api/aulas → Listar aulas del usuario autenticado (Docente o Estudiante)
router.get('/aulas', verificarTokenJWT, listarAulas)

// POST /api/aulas/unirse → Unirse a un aula con código (Solo Estudiante)
// IMPORTANTE: Esta ruta va ANTES de /aulas/:id para que Express no confunda "unirse" con un ID
router.post('/aulas/unirse', verificarTokenJWT, verificarRol('estudiante'), unirseAula)

// GET /api/aulas/:id → Detalle de un aula específica (Docente o Estudiante miembro)
router.get('/aulas/:id', verificarTokenJWT, obtenerAula)

// PUT /api/aulas/:id → Actualizar datos del aula (Solo Docente propietario)
router.put('/aulas/:id', verificarTokenJWT, verificarRol('docente'), actualizarAula)

// DELETE /api/aulas/:id → Archivar aula / soft delete (Solo Docente propietario)
router.delete('/aulas/:id', verificarTokenJWT, verificarRol('docente'), archivarAula)

export default router
