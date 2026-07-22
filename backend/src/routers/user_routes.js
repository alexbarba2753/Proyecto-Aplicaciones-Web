import { Router } from 'express'
import { confirmarMail, registro, crearNuevoPassword, recuperarPassword, comprobarTokenPasword, login, perfil, actualizarPerfil, actualizarPassword, verificarCedula } from '../controllers/usuario_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'
const router = Router()


router.post('/registro', registro)


router.get('/usuario/verificar-cedula/:cedula', verificarCedula)


router.get('/confirmar/:token', confirmarMail)


router.post('/recuperarpassword', recuperarPassword)


router.get('/recuperarpassword/:token', comprobarTokenPasword)


router.post('/nuevopassword/:token', crearNuevoPassword)


router.post('/usuario/login', login)


router.get('/usuario/perfil', verificarTokenJWT, perfil)


router.put('/usuario/actualizarperfil/:id', verificarTokenJWT, actualizarPerfil)


router.put('/usuario/actualizarpassword/:id', verificarTokenJWT, actualizarPassword)

export default router