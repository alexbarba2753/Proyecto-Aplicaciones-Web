import Mensaje from "../models/Mensaje.js"
import Aula from "../models/Aula.js"
import mongoose from "mongoose"


/**
 * CONTROLADOR: Obtiene el historial de mensajes de un aula específica.
 * 
 * Devuelve los mensajes paginados y ordenados del más reciente al más antiguo.
 * Solo accesible para usuarios que pertenezcan al aula (docente o estudiante inscrito).
 * 
 * Query params opcionales:
 * - page (default: 1): Número de página
 * - limit (default: 50): Mensajes por página (máximo 100)
 */
const obtenerMensajes = async (req, res) => {

    try {
        const { aulaId } = req.params
        const page = parseInt(req.query.page) || 1
        const limit = Math.min(parseInt(req.query.limit) || 50, 100)  // Máximo 100 por request

        // [PASO 1]: VALIDAR FORMATO DEL ID
        if (!mongoose.Types.ObjectId.isValid(aulaId)) {
            return res.status(400).json({ msg: `ID de aula inválido: ${aulaId}` })
        }

        // [PASO 2]: VERIFICAR QUE EL AULA EXISTE
        const aula = await Aula.findById(aulaId).lean()
        if (!aula) {
            return res.status(404).json({ msg: "Aula no encontrada" })
        }

        // [PASO 3]: VERIFICAR QUE EL USUARIO PERTENECE AL AULA
        const esDocente = aula.docente.toString() === req.usuario._id.toString()
        const esEstudiante = aula.estudiantes.some(
            estId => estId.toString() === req.usuario._id.toString()
        )

        if (!esDocente && !esEstudiante) {
            return res.status(403).json({ msg: "No tienes acceso a los mensajes de esta aula" })
        }

        // [PASO 4]: CONSULTAR MENSAJES CON PAGINACIÓN
        const skip = (page - 1) * limit

        const [mensajes, total] = await Promise.all([
            Mensaje.find({ aula: aulaId })
                .populate('remitente', 'nombre apellido perfil')
                .sort({ timestamp: -1 })    // Más recientes primero
                .skip(skip)
                .limit(limit)
                .lean(),
            Mensaje.countDocuments({ aula: aulaId })
        ])

        // [PASO 5]: RESPUESTA CON METADATA DE PAGINACIÓN
        res.status(200).json({
            mensajes,
            paginacion: {
                total,
                pagina: page,
                porPagina: limit,
                totalPaginas: Math.ceil(total / limit)
            }
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error.message}` })
    }
}


export { obtenerMensajes }
