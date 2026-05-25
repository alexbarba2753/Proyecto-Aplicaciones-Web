import jwt from "jsonwebtoken"
import Usuario from "../models/Usuario.js"

/**
 * GENERAR TOKEN: Crea un pase firmado matemáticamente para el usuario
 * @param {string} id - El _id único de MongoDB del usuario
 * @param {string} rol - El rol asignado (estudiante, docente, administrador, tutor)
 * @returns {string} - Cadena de texto del JWT firmado
 */
const crearTokenJWT = (id, rol) => {
    // jwt.sign empaqueta el id y el rol dentro del token, usando la frase secreta del .env
    // Configurado para que expire automáticamente en 1 día ("1d") por seguridad
    return jwt.sign({ id, rol }, process.env.JWT_SECRET, { expiresIn: "1d" })
}

/**
 * MIDDLEWARE: El guardia de seguridad que valida el token antes de dar acceso a rutas privadas
 */
const verificarTokenJWT = async (req, res, next) => {

    // [PASO 1]: Capturamos el encabezado 'authorization' 
    const { authorization } = req.headers
    
    // Si no enviaron el encabezado, detenemos la petición de inmediato (401: No autorizado)
    if (!authorization) return res.status(401).json({ msg: "Acceso denegado: token no proporcionado" })
    
    try {
        // [PASO 2]: Separamos el texto "Bearer [token]" y nos quedamos únicamente con el string del token
        const token = authorization.split(" ")[1]
        
        // [PASO 3]: Desencriptamos y validamos el token matemáticamente con la clave secreta
        // Si el token expiró o fue alterado, saltará directamente al bloque 'catch'
        const { id, rol } = jwt.verify(token, process.env.JWT_SECRET)
        
        // [PASO 4]: Buscamos al usuario en MongoDB por el ID que venía oculto dentro del token
        // Usamos '.lean()' para que la consulta sea ultra rápida devolviendo un objeto plano
        // Usamos '.select("-password")' para omitir la contraseña por estrictas razones de seguridad
        const usuarioBDD = await Usuario.findById(id).lean().select("-password")
        
        // Si por alguna razón el ID del token ya no existe en la base de datos (usuario eliminado/suspendido)
        if (!usuarioBDD) return res.status(401).json({ msg: "Usuario no encontrado" })
        
        // [PASO 5]: INYECCIÓN DE DATOS
        // Guardamos el objeto limpio del usuario directamente dentro de la petición ('req.usuario')
        // De esta manera, cualquier controlador que venga después podrá saber quién está navegando con solo leer 'req.usuario'
        req.usuario = usuarioBDD
        
        // [PASO 6]: LUZ VERDE
        // El guardia se hace a un lado y permite que Express continúe hacia el controlador final de la ruta
        next()

    } catch (error) {
        // Si jwt.verify falló porque el token caducó o fue inventado, atrapamos el error aquí
        console.log(error)
        return res.status(401).json({ msg: `Token inválido o expirado - ${error.message}` })
    }
}

// EXPORTACIÓN: Exportamos ambas herramientas de seguridad
export { 
    crearTokenJWT,
    verificarTokenJWT 
}