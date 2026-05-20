import {Router} from 'express'
import { confirmarMail, registro, crearNuevoPassword, recuperarPassword, comprobarTokenPasword , login } from '../controllers/usuario_controller.js'
const router = Router()


router.post('/registro',registro)
router.get('/confirmar/:token',confirmarMail)


router.post('/recuperarpassword',recuperarPassword)
router.get('/recuperarpassword/:token',comprobarTokenPasword)
router.post('/nuevopassword/:token',crearNuevoPassword)

router.post('/usuario/login',login)

export default router