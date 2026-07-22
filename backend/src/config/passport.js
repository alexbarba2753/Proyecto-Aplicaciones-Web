import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import Usuario from '../models/Usuario.js'
import dotenv from 'dotenv'
dotenv.config()

// ═══════════════════════════════════════════════════════
// CONFIGURACIÓN DE PASSPORT.JS CON GOOGLE OAUTH 2.0
// Permite a Docentes y Estudiantes iniciar sesión con su cuenta de Google.
// ═══════════════════════════════════════════════════════


/**
 * ESTRATEGIA GOOGLE OAUTH 2.0
 * 
 * Flujo:
 * 1. El usuario hace clic en "Ingresar con Google" en el frontend
 * 2. Se redirige a la pantalla de consentimiento de Google
 * 3. Google autentica y redirige al callback URL con el perfil del usuario
 * 4. Este callback busca/crea el usuario en MongoDB y genera el JWT
 */
passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        // Passport 0.7+ usa el nuevo flujo de state por defecto
        // Lo habilitamos para mayor seguridad contra ataques CSRF
        state: true
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Extraemos los datos relevantes del perfil de Google
            const googleId = profile.id
            const email = profile.emails?.[0]?.value
            const nombre = profile.name?.givenName || profile.displayName?.split(' ')[0] || 'Usuario'
            const apellido = profile.name?.familyName || profile.displayName?.split(' ').slice(1).join(' ') || 'Google'
            const fotoPerfil = profile.photos?.[0]?.value || null

            if (!email) {
                return done(new Error('No se pudo obtener el email de la cuenta de Google'), null)
            }

            // ═══════════════════════════════════════════════════════
            // CASO 1: ¿Ya existe un usuario con este googleId?
            // Si ya se logueó con Google antes, simplemente lo retornamos
            // ═══════════════════════════════════════════════════════
            let usuario = await Usuario.findOne({ googleId })

            if (usuario) {
                return done(null, usuario)
            }

            // ═══════════════════════════════════════════════════════
            // CASO 2: ¿Existe un usuario con el mismo email (registrado localmente)?
            // Vinculamos su cuenta local con Google para que pueda usar ambos métodos
            // ═══════════════════════════════════════════════════════
            usuario = await Usuario.findOne({ email })

            if (usuario) {
                // Vinculamos el googleId a la cuenta existente
                usuario.googleId = googleId
                // Si no tiene foto de perfil, usamos la de Google
                if (!usuario.perfil && fotoPerfil) {
                    usuario.perfil = fotoPerfil
                }
                await usuario.save()
                return done(null, usuario)
            }

            // ═══════════════════════════════════════════════════════
            // CASO 3: Usuario completamente nuevo (primera vez con Google)
            // Creamos una cuenta nueva con authProvider: 'google', sin password ni cédula
            // ═══════════════════════════════════════════════════════
            const nuevoUsuario = new Usuario({
                nombre,
                apellido,
                email,
                googleId,
                authProvider: 'google',
                perfil: fotoPerfil,
                confirmEmail: true,     // Las cuentas de Google ya están verificadas por Google
                rol: 'estudiante'       // Rol por defecto (el admin puede cambiarlo después)
            })

            await nuevoUsuario.save()
            return done(null, nuevoUsuario)

        } catch (error) {
            console.error('❌ Error en estrategia Google OAuth:', error)
            return done(error, null)
        }
    }
))


/**
 * SERIALIZACIÓN: Guarda el ID del usuario en la sesión
 * Se ejecuta después de una autenticación exitosa
 */
passport.serializeUser((usuario, done) => {
    done(null, usuario._id)
})


/**
 * DESERIALIZACIÓN: Recupera el usuario completo desde la sesión
 * Se ejecuta en cada request que use passport.session()
 */
passport.deserializeUser(async (id, done) => {
    try {
        const usuario = await Usuario.findById(id).select('-password')
        done(null, usuario)
    } catch (error) {
        done(error, null)
    }
})


export default passport
