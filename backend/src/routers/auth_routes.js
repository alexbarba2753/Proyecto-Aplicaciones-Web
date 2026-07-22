import { Router } from 'express'
import passport from '../config/passport.js'
import { crearTokenJWT } from '../middlewares/JWT.js'

const router = Router()

// ═══════════════════════════════════════════════════════
// RUTAS DE AUTENTICACIÓN CON GOOGLE OAUTH 2.0
// ═══════════════════════════════════════════════════════


/**
 * GET /api/auth/google
 * 
 * Inicia el flujo de autenticación con Google.
 * Redirige al usuario a la pantalla de consentimiento de Google
 * donde selecciona su cuenta y autoriza el acceso.
 * 
 * Scopes solicitados:
 * - 'profile': Nombre, apellido, foto de perfil
 * - 'email': Correo electrónico del usuario
 */
router.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        prompt: 'select_account'    // Siempre muestra el selector de cuentas de Google
    })
)


/**
 * GET /api/auth/google/callback
 * 
 * URL de callback que Google invoca después de la autenticación.
 * Passport procesa el perfil de Google usando la estrategia configurada en config/passport.js.
 * 
 * Si la autenticación es exitosa:
 * 1. Genera un JWT con el mismo formato que el login local
 * 2. Redirige al frontend con el token en los query params
 * 
 * Si falla:
 * 1. Redirige al frontend a la página de login con un mensaje de error
 */
router.get('/auth/google/callback',
    passport.authenticate('google', {
        session: false,             // No usamos sesiones persistentes, usamos JWT
        failureRedirect: `${process.env.URL_FRONTEND}login?error=google_auth_failed`
    }),
    (req, res) => {
        try {
            // El usuario autenticado viene en req.user (inyectado por Passport)
            const usuario = req.user

            // Normalizamos el rol a minúsculas
            const rol = usuario.rol?.toLowerCase().trim() || 'estudiante'

            // Generamos el MISMO token JWT que usamos en el login local
            // Esto garantiza que el sistema de autenticación sea unificado
            const token = crearTokenJWT(usuario._id, rol)

            // Redirigimos al frontend con los datos necesarios en la URL
            // El componente GoogleCallbackPage.jsx capturará estos params
            const frontendCallback = `${process.env.URL_FRONTEND}auth/google/callback`
            const params = new URLSearchParams({
                token,
                rol,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                _id: usuario._id.toString()
            })

            res.redirect(`${frontendCallback}?${params.toString()}`)

        } catch (error) {
            console.error('❌ Error en callback de Google OAuth:', error)
            res.redirect(`${process.env.URL_FRONTEND}login?error=token_generation_failed`)
        }
    }
)


export default router
