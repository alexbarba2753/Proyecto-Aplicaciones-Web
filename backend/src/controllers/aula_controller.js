// 1. IMPORTACIONES
import Aula from "../models/Aula.js"
import mongoose from "mongoose"


/**
 * CONTROLADOR: Crea una nueva aula virtual.
 * Solo accesible para usuarios con rol "docente".
 * Genera automáticamente un código de acceso único de 6 caracteres.
 */
const crearAula = async (req, res) => {

    try {
        // [PASO 1]: Extraemos los datos del formulario del Frontend
        const { nombre, empresa, descripcion } = req.body

        // [PASO 2]: VALIDACIÓN DE CAMPOS OBLIGATORIOS
        if (!nombre || !empresa) {
            return res.status(400).json({ msg: "El nombre del aula y la empresa son obligatorios" })
        }

        // [PASO 3]: VALIDACIÓN DE FORMATO DEL NOMBRE
        // Solo letras, números, espacios y caracteres acentuados. Mínimo 3, máximo 80 caracteres.
        const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s\-_.]{3,80}$/
        if (!regexNombre.test(nombre)) {
            return res.status(400).json({ msg: "El nombre del aula debe tener entre 3 y 80 caracteres válidos" })
        }

        // [PASO 4]: VALIDACIÓN DE FORMATO DE LA EMPRESA
        const regexEmpresa = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s\-_.&]{2,100}$/
        if (!regexEmpresa.test(empresa)) {
            return res.status(400).json({ msg: "El nombre de la empresa debe tener entre 2 y 100 caracteres válidos" })
        }

        // [PASO 5]: VALIDACIÓN DE LA DESCRIPCIÓN (opcional pero con límite)
        if (descripcion && descripcion.length > 200) {
            return res.status(400).json({ msg: "La descripción no puede superar los 200 caracteres" })
        }

        // [PASO 6]: GENERAR CÓDIGO DE ACCESO ÚNICO
        // Usamos el método estático del Schema que garantiza unicidad en la BDD
        const codigoAcceso = await Aula.generarCodigoUnico()

        // [PASO 7]: CREAR EL DOCUMENTO EN MEMORIA
        const nuevaAula = new Aula({
            nombre: nombre.trim(),
            empresa: empresa.trim(),
            descripcion: descripcion?.trim() || null,
            codigoAcceso,
            docente: req.usuario._id,  // El ID del docente viene del middleware verificarTokenJWT
            estudiantes: []
        })

        // [PASO 8]: GUARDAR EN MONGODB
        await nuevaAula.save()

        // [PASO 9]: RESPUESTA EXITOSA
        res.status(201).json({
            msg: "Aula creada exitosamente",
            aula: nuevaAula
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error.message}` })
    }
}


/**
 * CONTROLADOR: Lista todas las aulas asociadas al usuario autenticado.
 * Funciona de forma dinámica:
 *   - Si es Docente → filtra por { docente: req.usuario._id }
 *   - Si es Estudiante → filtra por { estudiantes: req.usuario._id }
 */
const listarAulas = async (req, res) => {

    try {
        const { _id, rol } = req.usuario
        let filtro = {}

        // [PASO 1]: CONSTRUIR FILTRO DINÁMICO SEGÚN EL ROL
        if (rol === "docente") {
            // El docente ve las aulas que él creó
            filtro = { docente: _id, estado: true }
        } else if (rol === "estudiante") {
            // El estudiante ve las aulas donde está inscrito
            filtro = { estudiantes: _id, estado: true }
        } else if (rol === "tutor") {
            // El tutor por ahora ve las aulas donde está como estudiante (futuro: campo propio)
            filtro = { estudiantes: _id, estado: true }
        } else {
            return res.status(403).json({ msg: "Rol no autorizado para listar aulas" })
        }

        // [PASO 2]: CONSULTAR LA BASE DE DATOS
        // Populamos el nombre del docente para mostrarlo en las tarjetas
        // Usamos .lean() para obtener objetos planos optimizados en RAM
        const aulas = await Aula.find(filtro)
            .populate('docente', 'nombre apellido email')
            .select('-__v')
            .sort({ createdAt: -1 })
            .lean()

        // [PASO 3]: RESPUESTA EXITOSA
        res.status(200).json(aulas)

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error.message}` })
    }
}


/**
 * CONTROLADOR: Obtiene el detalle completo de un aula específica.
 * Resuelve las referencias con .populate() y optimiza con .lean().
 */
const obtenerAula = async (req, res) => {

    try {
        const { id } = req.params

        // [PASO 1]: VALIDAR FORMATO DEL ID DE MONGODB
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: `ID de aula inválido: ${id}` })
        }

        // [PASO 2]: BUSCAR EL AULA CON DATOS POPULADOS
        // Resolvemos las referencias para que el Frontend reciba directamente
        // los datos del docente y de cada estudiante sin hacer consultas extra
        const aula = await Aula.findById(id)
            .populate('docente', 'nombre apellido email')
            .populate('estudiantes', 'nombre apellido email')
            .select('-__v')
            .lean()

        // [PASO 3]: VERIFICAR EXISTENCIA
        if (!aula) {
            return res.status(404).json({ msg: "Aula no encontrada" })
        }

        // [PASO 4]: VERIFICAR QUE EL USUARIO PERTENEZCA AL AULA
        // El docente creador o un estudiante inscrito pueden ver el detalle
        const esDocente = aula.docente._id.toString() === req.usuario._id.toString()
        const esEstudiante = aula.estudiantes.some(
            est => est._id.toString() === req.usuario._id.toString()
        )

        if (!esDocente && !esEstudiante) {
            return res.status(403).json({ msg: "No tienes acceso a esta aula" })
        }

        // [PASO 5]: RESPUESTA EXITOSA
        res.status(200).json(aula)

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error.message}` })
    }
}


/**
 * CONTROLADOR: Actualiza los datos generales de un aula.
 * Solo el docente propietario puede modificar su aula.
 */
const actualizarAula = async (req, res) => {

    try {
        const { id } = req.params
        const { nombre, empresa, descripcion } = req.body

        // [PASO 1]: VALIDAR FORMATO DEL ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: `ID de aula inválido: ${id}` })
        }

        // [PASO 2]: BUSCAR EL AULA EN LA BDD
        const aula = await Aula.findById(id)
        if (!aula) {
            return res.status(404).json({ msg: "Aula no encontrada" })
        }

        // [PASO 3]: VERIFICAR PROPIEDAD DEL RECURSO
        // Solo el docente que creó el aula puede editarla
        if (aula.docente.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({ msg: "Solo el docente propietario puede editar esta aula" })
        }

        // [PASO 4]: VALIDACIONES DE FORMATO (si se envían datos nuevos)
        if (nombre) {
            const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s\-_.]{3,80}$/
            if (!regexNombre.test(nombre)) {
                return res.status(400).json({ msg: "El nombre del aula debe tener entre 3 y 80 caracteres válidos" })
            }
        }

        if (empresa) {
            const regexEmpresa = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s\-_.&]{2,100}$/
            if (!regexEmpresa.test(empresa)) {
                return res.status(400).json({ msg: "El nombre de la empresa debe tener entre 2 y 100 caracteres válidos" })
            }
        }

        if (descripcion && descripcion.length > 200) {
            return res.status(400).json({ msg: "La descripción no puede superar los 200 caracteres" })
        }

        // [PASO 5]: ASIGNAR NUEVOS VALORES (Operador ??)
        aula.nombre = nombre?.trim() ?? aula.nombre
        aula.empresa = empresa?.trim() ?? aula.empresa
        aula.descripcion = descripcion?.trim() ?? aula.descripcion

        // [PASO 6]: GUARDAR CAMBIOS EN MONGO
        await aula.save()

        // [PASO 7]: RESPUESTA EXITOSA
        res.status(200).json({
            msg: "Aula actualizada correctamente",
            aula
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error.message}` })
    }
}


/**
 * CONTROLADOR: Archiva (soft delete) un aula al finalizar el ciclo académico.
 * Solo el docente propietario puede archivar sus aulas.
 * No elimina el documento; cambia el campo 'estado' a false.
 */
const archivarAula = async (req, res) => {

    try {
        const { id } = req.params

        // [PASO 1]: VALIDAR FORMATO DEL ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: `ID de aula inválido: ${id}` })
        }

        // [PASO 2]: BUSCAR EL AULA
        const aula = await Aula.findById(id)
        if (!aula) {
            return res.status(404).json({ msg: "Aula no encontrada" })
        }

        // [PASO 3]: VERIFICAR PROPIEDAD
        if (aula.docente.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({ msg: "Solo el docente propietario puede archivar esta aula" })
        }

        // [PASO 4]: VERIFICAR QUE NO ESTÉ YA ARCHIVADA
        if (!aula.estado) {
            return res.status(400).json({ msg: "Esta aula ya se encuentra archivada" })
        }

        // [PASO 5]: SOFT DELETE - Cambiamos el estado a false
        aula.estado = false
        await aula.save()

        // [PASO 6]: RESPUESTA EXITOSA
        res.status(200).json({ msg: "Aula archivada correctamente" })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error.message}` })
    }
}


/**
 * CONTROLADOR: Permite a un estudiante unirse a un aula mediante un código de acceso.
 * Busca el aula por código, verifica que no esté ya inscrito, y hace push del ID.
 */
const unirseAula = async (req, res) => {

    try {
        const { codigoAcceso } = req.body

        // [PASO 1]: VALIDAR QUE SE ENVIÓ EL CÓDIGO
        if (!codigoAcceso || codigoAcceso.trim() === "") {
            return res.status(400).json({ msg: "Debes ingresar un código de acceso" })
        }

        // [PASO 2]: VALIDAR FORMATO DEL CÓDIGO (6 caracteres alfanuméricos)
        const codigoLimpio = codigoAcceso.trim().toUpperCase()
        if (!/^[A-Z0-9]{6}$/.test(codigoLimpio)) {
            return res.status(400).json({ msg: "El código de acceso debe tener exactamente 6 caracteres alfanuméricos" })
        }

        // [PASO 3]: BUSCAR EL AULA POR EL CÓDIGO
        const aula = await Aula.findOne({ codigoAcceso: codigoLimpio, estado: true })
        if (!aula) {
            return res.status(404).json({ msg: "Código de acceso inválido o aula no disponible" })
        }

        // [PASO 4]: VERIFICAR QUE EL ESTUDIANTE NO ESTÉ YA INSCRITO
        const yaInscrito = aula.estudiantes.some(
            estId => estId.toString() === req.usuario._id.toString()
        )
        if (yaInscrito) {
            return res.status(409).json({ msg: "Ya estás inscrito en esta aula" })
        }

        // [PASO 5]: VERIFICAR QUE NO SEA EL DOCENTE INTENTANDO UNIRSE A SU PROPIA AULA
        if (aula.docente.toString() === req.usuario._id.toString()) {
            return res.status(400).json({ msg: "No puedes unirte a tu propia aula como estudiante" })
        }

        // [PASO 6]: EMPUJAR (PUSH) EL ID DEL ESTUDIANTE AL ARREGLO
        // Usamos $addToSet para mayor seguridad (evita duplicados a nivel de MongoDB)
        await Aula.findByIdAndUpdate(aula._id, {
            $addToSet: { estudiantes: req.usuario._id }
        })

        // [PASO 7]: RESPUESTA EXITOSA
        res.status(200).json({ msg: `Te has unido exitosamente al aula "${aula.nombre}"` })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error.message}` })
    }
}


// Exportamos todos los controladores del módulo de aulas
export {
    crearAula,
    listarAulas,
    obtenerAula,
    actualizarAula,
    archivarAula,
    unirseAula
}
