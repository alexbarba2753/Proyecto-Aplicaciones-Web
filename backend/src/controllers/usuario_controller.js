// 1. IMPORTACIONES: Traemos el modelo de la Base de Datos y el ayudante de correos
import Usuario from "../models/Usuario.js";
import { sendMailToRegister, sendMailToRecoveryPassword } from "../helpers/sendMail.js";
import { crearTokenJWT } from "../middlewares/JWT.js";
import { validarCedulaEcuador } from "../helpers/validarCedula.js";
import { generarAvatarIA } from "../helpers/generateAvatar.js";
import mongoose from "mongoose"

/**
 * Maneja el registro de nuevos usuarios (Estudiantes, Docentes, Tutores)
 * 
 * Flujo Sprint 3:
 * 1. Validar campos vacíos
 * 2. Validar email duplicado
 * 3. 🆕 Validar cédula con EcuadorAPI (prellenar nombre/apellido con datos reales)
 * 4. 🆕 Generar avatar con IA (Hugging Face → Cloudinary)
 * 5. Encriptar password + crear token de confirmación
 * 6. Enviar correo de confirmación
 * 7. Guardar en MongoDB
 */
const registro = async (req, res) => {

    try {
        // [PASO 1]: Extraemos el email y password del cuerpo de la petición (lo que viene del formulario)
        const { email, password, cedula } = req.body;
        
        // [PASO 2]: VALIDACIÓN DE CAMPOS VACÍOS
        // Convertimos el objeto req.body en un arreglo de valores y verificamos si alguno es un texto vacío ("")
        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
        }
        
        // [PASO 3]: VALIDACIÓN DE DUPLICADOS EN BDD
        // Hacemos una consulta asíncrona a MongoDB para ver si ya existe alguien con ese mismo correo 
        const verificarEmailBDD = await Usuario.findOne({ email });
        if (verificarEmailBDD) {
            return res.status(400).json({ msg: "Lo sentimos, el email ya se encuentra registrado" });
        }

        // ═══════════════════════════════════════════════════════
        // 🆕 [PASO 3.5]: VALIDAR CÉDULA CON ECUADORAPI
        // Obligatorio en registro local. Verifica que la persona exista en el Registro Civil.
        // ═══════════════════════════════════════════════════════
        
        if (!cedula) {
            return res.status(400).json({ msg: "La cédula es obligatoria para el registro" });
        }

        // Verificar que la cédula no esté ya registrada en otro usuario
        const cedulaExistente = await Usuario.findOne({ cedula });
        if (cedulaExistente) {
            return res.status(400).json({ msg: "La cédula ya se encuentra registrada en otro usuario" });
        }

        let datosRegistroCivil;
        try {
            datosRegistroCivil = await validarCedulaEcuador(cedula);
        } catch (errorCedula) {
            return res.status(400).json({ msg: errorCedula.message || "La cédula no es válida o no existe en el registro civil" });
        }

        // Si EcuadorAPI devolvió nombres reales, los usamos para prellenar (garantiza datos verídicos)
        if (datosRegistroCivil.nombre) {
            req.body.nombre = datosRegistroCivil.nombre;
        }
        if (datosRegistroCivil.apellido) {
            req.body.apellido = datosRegistroCivil.apellido;
        }
        
        // [PASO 4]: NORMALIZAR EL ROL A MINÚSCULAS
        // Aseguramos consistencia independientemente de cómo llegue del formulario
        if (req.body.rol) {
            req.body.rol = req.body.rol.toLowerCase().trim();
        }

        // [PASO 5]: INSTANCIAR EL NUEVO USUARIO
        // Creamos un nuevo documento en memoria RAM usando la estructura de nuestro Usuario Schema
        const nuevoUsuario = new Usuario(req.body);

        // ═══════════════════════════════════════════════════════
        // 🆕 [PASO 5.5]: GENERAR AVATAR CON IA Y SUBIR A CLOUDINARY
        // Genera una imagen única con Hugging Face y la aloja en Cloudinary.
        // Si falla, el registro continúa normalmente (graceful degradation).
        // ═══════════════════════════════════════════════════════
        
        const avatarUrl = await generarAvatarIA(nuevoUsuario._id.toString());
        if (avatarUrl) {
            nuevoUsuario.perfil = avatarUrl;
        }
        
        // [PASO 6]: ENCRIPTAR CONTRASEÑA
        // Llamamos al método asíncrono del modelo para transformar la clave en texto plano a un hash seguro de bcrypt
        nuevoUsuario.password = await nuevoUsuario.encryptPassword(password);
        
        // [PASO 7]: GENERAR TOKEN TEMPORAL
        // Creamos la cadena aleatoria para la verificación del correo
        const token = nuevoUsuario.createToken();
        
        // [PASO 8]: ENVIAR NOTIFICACIÓN POR CORREO
        // Disparamos el correo llevando el token en el enlace de confirmación
        await sendMailToRegister(email, token);
        
        // [PASO 9]: GUARDAR EN BASE DE DATOS
        // Impactamos finalmente la base de datos MongoDB local guardando permanentemente el nuevo usuario
        await nuevoUsuario.save();
        
        // [PASO 10]: RESPUESTA EXITOSA Al FRONTEND
        // Si todo salió bien hasta aquí, respondemos al usuario con un estado 200 (OK)
        res.status(200).json({ msg: "Revisa tu correo electrónico para confirmar tu cuenta" });

    } catch (error) {
        // MANEJO DE ERRORES: Si algo falla (ej. se cayó la base de datos), cae aquí
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` });
    }

}

/**
 * Confirma la cuenta del usuario mediante el token enviado por correo
 */
const confirmarMail = async (req, res) => {
    try {
        // [PASO 1]: Extraer el token de la URL
        // req.params captura las variables que viajan directamente en la ruta (ej: /api/confirmar/:token)
        const { token } = req.params;

        // [PASO 2]: BUSCAR AL USUARIO POR EL TOKEN
        // Salimos a buscar en MongoDB si existe algún usuario (sea estudiante, docente o tutor) 
        // que tenga guardado exactamente ese mismo token temporal.
        // Como es una consulta externa a la Base de Datos, usamos obligatoriamente 'await'.
        const usuarioBDD = await Usuario.findOne({ token });
        
        // Si el token no existe en la BDD (o ya fue usado y borrado), frenamos el proceso.
        if (!usuarioBDD) {
            return res.status(404).json({ msg: "Token inválido o cuenta ya confirmada" });
        }

        // [PASO 3]: ACTUALIZAR EL ESTADO DEL USUARIO
        // Como el token coincidió, procedemos a "quemarlo" (limpiarlo) cambiándolo a null 
        // para que nadie pueda volver a usar el mismo enlace.
        usuarioBDD.token = null;
        
        // Cambiamos el estado de confirmación a true. Esto le permitirá pasar la validación del Login.
        usuarioBDD.confirmEmail = true;

        // [PASO 4]: GUARDAR LOS CAMBIOS EN MONGO
        // Guardamos físicamente el documento actualizado en la base de datos local. 
        // Como impacta el disco duro/red, requiere 'await'.
        await usuarioBDD.save();

        // [PASO 5]: RESPUESTA EXITOSA
        // Notificamos al Frontend que la cuenta ha sido activada con éxito.
        res.status(200).json({ msg: "Cuenta confirmada, ya puedes iniciar sesión" });

    } catch (error) {
        // Captura cualquier fallo crítico en el proceso 
        console.error(error);
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` });
    }
}


/**
 * SOLICITAR RECUPERACIÓN: Verifica el email y envía el correo con el token
 */
const recuperarPassword = async (req, res) => {
    try {
        // [PASO 1]: Extraemos el correo del formulario del Frontend (req.body)
        const { email } = req.body;
        
        // [PASO 2]: VALIDACIÓN DE EXISTENCIA
        if (!email) return res.status(400).json({ msg: "Debes ingresar un correo electrónico" });
        
        // Consultamos a MongoDB si existe algún usuario registrado con ese correo 
        const usuarioBDD = await Usuario.findOne({ email });
        if (!usuarioBDD) return res.status(404).json({ msg: "El usuario no se encuentra registrado" });
        
        // [PASO 3]: ASIGNAR TOKEN Y NOTIFICAR
        // Usamos el método matemático que creamos en el Schema para inyectarle un nuevo token temporal
        const token = usuarioBDD.createToken();
        usuarioBDD.token = token;
        
        // Enviamos el correo con el enlace seguro 
        await sendMailToRecoveryPassword(email, token);
        
        // Guardamos los cambios en MongoDB (registramos el token en su cuenta)
        await usuarioBDD.save();
        
        // [PASO 4]: RESPUESTA EXITOSA
        res.status(200).json({ msg: "Revisa tu correo electrónico para reestablecer tu cuenta" });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` });
    }
}

/**
 * COMPROBAR TOKEN: Valida si el enlace al que dio clic el usuario aún sirve
 */
const comprobarTokenPasword = async (req, res) => {
    try {
        // [PASO 1]: Capturamos el token de recuperación directamente desde la URL (req.params)
        const { token } = req.params;
        
        // [PASO 2]: VALIDAR EN BASE DE DATOS
        // Buscamos en MongoDB si hay algún usuario que tenga asignado ese token exacto
        const usuarioBDD = await Usuario.findOne({ token });
        
        // Usamos el operador opcional (?.) para evitar que el código explote si usuarioBDD es undefined.
        // Si no se encuentra el usuario o el token no coincide, rechazamos la validación.
        if (usuarioBDD?.token !== token) {
            return res.status(404).json({ msg: "Lo sentimos, no se puede validar la cuenta" });
        }
        
        // [PASO 3]: RESPUESTA EXITOSA
        // Si pasó el filtro, le damos luz verde al Frontend para que pinte el formulario de la nueva contraseña
        res.status(200).json({ msg: "Token confirmado, ya puedes crear tu nuevo password" }); 
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` });
    }
}

/**
 * 3. CREAR NUEVO PASSWORD: Recibe las nuevas contraseñas y las sobreescribe encriptadas
 */
const crearNuevoPassword = async (req, res) => {
    try {
        // [PASO 1]: Extraemos la nueva clave y su confirmación del body, y el token de la URL
        const { password, confirmpassword } = req.body;
        const { token } = req.params;
        
        // [PASO 2]: VALIDACIONES DE INTEGRIDAD
        // Revisamos que no manden campos en blanco
        if (Object.values(req.body).includes("")) {
            return res.status(404).json({ msg: "Debes llenar todos los campos" });
        }
        // Validamos que hayan escrito exactamente lo mismo en ambos inputs
        if (password !== confirmpassword) {
            return res.status(404).json({ msg: "Los passwords no coinciden" });
        }
        
        // Volvemos a buscar al usuario por su token para asegurar que no haya expirado en el proceso
        const usuarioBDD = await Usuario.findOne({ token });
        if (!usuarioBDD) return res.status(404).json({ msg: "No se puede validar la cuenta" });
        
        // [PASO 3]: QUEMAR TOKEN Y ENCRIPTAR NUEVA CLAVE
        // Como la operación fue exitosa, eliminamos el token cambiándolo a null para que el link expire definitivamente
        usuarioBDD.token = null;
        
        // Ciframos la nueva contraseña con el algoritmo de bcrypt usando el método del Schema
        usuarioBDD.password = await usuarioBDD.encryptPassword(password);
        
        // Impactamos los cambios finales en la base de datos local
        await usuarioBDD.save();
        
        // [PASO 4]: RESPUESTA DE ÉXITO FINAL
        res.status(200).json({ msg: "Felicitaciones, ya puedes iniciar sesión con tu nuevo password" }); 

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` });
    }
}


/**
 * CONTROLADOR: Valida las credenciales del usuario y permite el inicio de sesión
 */
const login = async (req, res) => {

    try {
        // [PASO 1]: Extraemos las credenciales que el usuario metió en el formulario de Login
        const { email, password } = req.body;
        
        // [PASO 2]: VALIDACIÓN DE CAMPOS VACÍOS
        if (Object.values(req.body).includes("")) {
            return res.status(404).json({ msg: "Debes llenar todos los campos" });
        }
        
        // [PASO 3]: BUSCAR AL USUARIO Y FILTRAR CAMPOS
        // Buscamos en MongoDB por correo
        // Usamos .select() con signos de menos (-) para excluir campos internos que el Frontend no necesita saber.
        // Como es una consulta asíncrona a la base de datos de Compass, lleva obligatoriamente 'await'.
        const usuarioBDD = await Usuario.findOne({ email }).select("-status -__v -token -updatedAt -createdAt");
        
        // Si no encuentra ningún documento con ese correo, frena el proceso
        if (!usuarioBDD) {
            return res.status(404).json({ msg: "El usuario no se encuentra registrado" });
        }

        // 🆕 Verificar que el usuario no se haya registrado solo con Google (sin password local)
        if (usuarioBDD.authProvider === 'google' && !usuarioBDD.password) {
            return res.status(400).json({ msg: "Esta cuenta fue registrada con Google. Usa el botón 'Ingresar con Google' para iniciar sesión" });
        }
        
        // [PASO 4]: VALIDACIÓN DE CUENTA VERIFICADA
        // Si el usuario no ha hecho clic en el enlace de confirmación que programamos antes, le negamos el acceso (Estado 403: Prohibido)
        if (!usuarioBDD.confirmEmail) {
            return res.status(403).json({ msg: "Debes verificar tu cuenta antes de iniciar sesión" });
        }
        
        // [PASO 5]: VERIFICACIÓN DE CONTRASEÑA
        // Invocamos al método seguro matchPassword de bcrypt que está en tu Schema.
        // Como bcrypt compara strings encriptados mediante operaciones matemáticas complejas, requiere 'await'.
        const verificarPassword = await usuarioBDD.matchPassword(password);
        if (!verificarPassword) {
            return res.status(401).json({ msg: "El password no es correcto" });
        }
        
        // [PASO 6]: PREPARAR DATOS DE SESIÓN
        // Desestructuramos el objeto.
        const { nombre, apellido, direccion, celular, _id, perfil } = usuarioBDD;

        // Normalizamos el rol a minúsculas para compatibilidad con cuentas antiguas
        const rol = usuarioBDD.rol?.toLowerCase().trim() || 'estudiante';

        // Generamos un token JWT que incluye el ID y el rol del usuario, usando la función que creamos en el middleware de JWT.
        const token = crearTokenJWT(usuarioBDD._id, rol);

        // [PASO 7]: RESPUESTA EXITOSA
        // Devolvemos los datos limpios para que guarde el perfil en su estado global.
        res.status(200).json({
            token,
            rol,
            nombre,
            apellido,
            direccion,
            celular,
            _id,
            email: usuarioBDD.email,
            perfil    // 🆕 Incluimos la URL de Cloudinary del avatar
        });

    } catch (error) {
        // Manejo de fallos del servidor
        console.error(error);
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` });
    }
}


/**
 * CONTROLADOR: Devuelve los datos del perfil del usuario logueado actualmente.
 */
const perfil = (req, res) => {
    
    // [PASO 1]: DESESTRUCTURACIÓN CON OPERADOR REST
    // Tomamos el objeto 'req.usuario' (que nuestro middleware verificarTokenJWT inyectó con éxito).
    // Extraemos individualmente los campos internos que NO queremos mandarle al Frontend (token, confirmEmail, etc.)
    const { token, confirmEmail, createdAt, updatedAt, __v, ...datosPerfil } = req.usuario;
    
    // [PASO 2]: RESPUESTA AL CLIENTE
    // Enviamos el objeto 'datosPerfil' completamente limpio y pulido de vuelta al Frontend 
    res.status(200).json(datosPerfil);
}

/**
 * CONTROLADOR: Actualiza los datos del perfil de un usuario existente.
 */
const actualizarPerfil = async (req, res) => {

    try {
        // [PASO 1]: Extraemos el ID de la URL (params) y los nuevos datos del formulario (body)
        const { id } = req.params;
        const { nombre, apellido, direccion, celular, email } = req.body;
        
        // [PASO 2]: VALIDACIÓN DE SINTAXIS DEL ID
        // Mongoose verifica si el string del ID tiene la estructura correcta de 24 caracteres hexadecimales de MongoDB.
        // Si mandan un ID alterado (ej: /api/actualizar/123), frena el código para que Mongoose no explote.
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: `ID inválido: ${id}` });
        }
        
        // [PASO 3]: VERIFICAR SI EL USUARIO EXISTE EN COMPASS
        const usuarioBDD = await Usuario.findById(id);
        if (!usuarioBDD) {
            return res.status(404).json({ msg: `No existe el usuario con ID ${id}` });
        }
        
        // [PASO 4]: VALIDACIÓN DE CAMPOS VACÍOS
        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ msg: "Debes llenar todos los campos" });
        }
        
        // [PASO 5]: CONTROL DE CORREOS DUPLICADOS
        // Si el usuario está intentando cambiar su email por uno nuevo...
        if (usuarioBDD.email !== email) {
            // Salimos a buscar si ese NUEVO email ya le pertenece a otro estudiante o docente en el sistema
            const emailExistente = await Usuario.findOne({ email });
            if (emailExistente) {
                return res.status(404).json({ msg: `El email ya se encuentra registrado` });  
            }
        }
        
        // [PASO 6]: ASIGNACIÓN DE NUEVOS VALORES (Operador ??)
        // Si llega un dato nuevo en el body lo usa; si llega como null o undefined, conserva el que ya estaba en la BDD.
        usuarioBDD.nombre = nombre ?? usuarioBDD.nombre;
        usuarioBDD.apellido = apellido ?? usuarioBDD.apellido;
        usuarioBDD.direccion = direccion ?? usuarioBDD.direccion;
        usuarioBDD.celular = celular ?? usuarioBDD.celular;
        usuarioBDD.email = email ?? usuarioBDD.email;
        
        // [PASO 7]: GUARDAR CAMBIOS EN MONGO LOCAL
        await usuarioBDD.save();
        
        // [PASO 8]: RESPUESTA EXITOSA
        // Devolvemos el documento actualizado para que el Frontend refresque la interfaz del usuario
        res.status(200).json(usuarioBDD);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` });
    }
}

/**
 * CONTROLADOR: Permite a un usuario logueado cambiar su contraseña desde su perfil.
 */
const actualizarPassword = async (req, res) => {
    try {
        // [PASO 1]: IDENTIFICAR AL USUARIO LOGUEADO
        // Usamos el ID del usuario que nuestro middleware 'verificarTokenJWT' inyectó de forma segura en 'req.usuario'.
        // Salimos a buscar el documento completo en MongoDB Compass local usando 'await'.
        const usuarioBDD = await Usuario.findById(req.usuario._id);
        
        // Si por alguna razón extraña el usuario ya no existe en la base de datos
        if (!usuarioBDD) {
            return res.status(404).json({ msg: "Lo sentimos, el usuario no existe" });
        }

        // 🆕 Verificar que el usuario tenga contraseña local (no es usuario solo de Google)
        if (usuarioBDD.authProvider === 'google' && !usuarioBDD.password) {
            return res.status(400).json({ msg: "Tu cuenta fue registrada con Google y no tiene contraseña local para cambiar" });
        }

        // [PASO 2]: VERIFICAR LA CONTRASEÑA ACTUAL
        // Tomamos el campo 'passwordactual' que el usuario escribió en el formulario (req.body)
        // y lo comparamos con el hash encriptado de la Base de Datos usando nuestro método 'matchPassword'.
        const verificarPassword = await usuarioBDD.matchPassword(req.body.passwordactual);
        
        // Si no coincide, frenamos el proceso de inmediato por seguridad (no dejamos que cambie la clave)
        if (!verificarPassword) {
            return res.status(404).json({ msg: "Lo sentimos, el password actual no es el correcto" });
        }

        // [PASO 3]: ENCRIPTAR Y GUARDAR LA NUEVA CONTRASEÑA
        // Si la clave actual fue correcta, tomamos 'passwordnuevo', lo pasamos por el encriptador de bcrypt
        // y lo asignamos al documento del usuario.
        usuarioBDD.password = await usuarioBDD.encryptPassword(req.body.passwordnuevo);
        
        // Guardamos físicamente los cambios en la base de datos local
        await usuarioBDD.save();

        // [PASO 4]: RESPUESTA EXITOSA
        res.status(200).json({ msg: "Password actualizado correctamente" });

    } catch (error) {
        // Atrapamos cualquier error del servidor
        console.error(error);
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` });
    }
}

/**
 * CONTROLADOR: Verifica una cédula con EcuadorAPI y devuelve nombre y apellido
 */
const verificarCedula = async (req, res) => {
    try {
        const { cedula } = req.params;
        
        if (!cedula || cedula.length !== 10) {
            return res.status(400).json({ msg: "La cédula debe tener 10 dígitos" });
        }

        // Usamos la función helper que ya tiene la lógica de EcuadorAPI
        const datos = await validarCedulaEcuador(cedula);
        
        if (datos.nombre || datos.apellido) {
            return res.status(200).json(datos);
        } else {
            return res.status(404).json({ msg: "Cédula no encontrada en el registro civil" });
        }

    } catch (error) {
        return res.status(400).json({ msg: error.message || "Error al verificar la cédula" });
    }
}

// Exportamos toda la lista final de controladores unificados de tu proyecto
export {
    registro,
    confirmarMail,
    recuperarPassword,
    comprobarTokenPasword,
    crearNuevoPassword,
    login,
    perfil,
    actualizarPerfil,
    actualizarPassword,
    verificarCedula
}