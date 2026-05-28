import { Router } from 'express'
import { confirmarMail, registro, crearNuevoPassword, recuperarPassword, comprobarTokenPasword, login, perfil, actualizarPerfil, actualizarPassword } from '../controllers/usuario_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'
const router = Router()

/**
 * @openapi
 * /registro:
 * post:
 * summary: Registrar un nuevo usuario
 * description: Registra un usuario en el sistema y envía un correo de confirmación.
 * responses:
 * 200:
 * description: Usuario registrado con éxito.
 */
router.post('/registro', registro)

/**
 * @openapi
 * /confirmar/{token}:
 * get:
 * summary: Confirmar cuenta mediante Token
 * description: Valida el token enviado al correo para activar la cuenta del usuario.
 * parameters:
 * - in: path
 * name: token
 * required: true
 * schema:
 * type: string
 * description: Token único de confirmación.
 * responses:
 * 200:
 * description: Cuenta confirmada exitosamente.
 */
router.get('/confirmar/:token', confirmarMail)

/**
 * @openapi
 * /recuperarpassword:
 * post:
 * summary: Solicitar recuperación de contraseña
 * description: Envía un enlace con un token al correo del usuario para restablecer su clave.
 * responses:
 * 200:
 * description: Correo de recuperación enviado.
 */
router.post('/recuperarpassword', recuperarPassword)

/**
 * @openapi
 * /recuperarpassword/{token}:
 * get:
 * summary: Comprobar token de recuperación
 * description: Verifica si el token de recuperación de contraseña sigue siendo válido.
 * parameters:
 * - in: path
 * name: token
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Token válido.
 */
router.get('/recuperarpassword/:token', comprobarTokenPasword)

/**
 * @openapi
 * /nuevopassword/{token}:
 * post:
 * summary: Establecer nueva contraseña
 * description: Permite guardar la nueva contraseña utilizando el token de validación.
 * parameters:
 * - in: path
 * name: token
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Contraseña actualizada con éxito.
 */
router.post('/nuevopassword/:token', crearNuevoPassword)

/**
 * @openapi
 * /usuario/login:
 * post:
 * summary: Iniciar sesión
 * description: Autentica al usuario y retorna un token JWT.
 * responses:
 * 200:
 * description: Autenticación exitosa.
 */
router.post('/usuario/login', login)

/**
 * @openapi
 * /usuario/perfil:
 *   get:
 *     summary: Obtener perfil del usuario
 *     description: Retorna los datos del usuario autenticado (Requiere Token JWT).
 *     responses:
 *       200:
 *         description: Datos del perfil obtenidos correctamente.
 */
router.get('/usuario/perfil', verificarTokenJWT, perfil)

/**
 * @openapi
 * /usuario/actualizarperfil/{id}:
 *   put:
 *     summary: Actualizar datos del perfil
 *     description: Modifica la información del usuario por su ID (Requiere Token JWT).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Perfil actualizado correctamente.
 */
router.put('/usuario/actualizarperfil/:id', verificarTokenJWT, actualizarPerfil)

/**
 * @openapi
 * /usuario/actualizarpassword/{id}:
 *   put:
 *     summary: Cambiar contraseña desde el perfil
 *     description: Permite al usuario logueado cambiar su clave actual por una nueva (Requiere Token JWT).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contraseña cambiada con éxito.
 */
router.put('/usuario/actualizarpassword/:id', verificarTokenJWT, actualizarPassword)

export default router