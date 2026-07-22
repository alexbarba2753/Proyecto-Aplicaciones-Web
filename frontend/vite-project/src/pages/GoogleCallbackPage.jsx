import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import storeAuth from '../context/storeAuth'

/**
 * COMPONENTE: GoogleCallbackPage
 * 
 * Página intermedia que captura el token JWT y los datos del usuario
 * desde la URL de callback de Google OAuth.
 * 
 * Flujo:
 * 1. Google redirige aquí: /auth/google/callback?token=xxx&rol=yyy&nombre=zzz
 * 2. Este componente extrae los query params
 * 3. Guarda el token y el rol en Zustand (localStorage persistido)
 * 4. Redirige automáticamente al Dashboard
 * 
 * Si hay un error (parámetros faltantes), muestra un mensaje y redirige al login.
 */
const GoogleCallbackPage = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { setToken, setRol } = storeAuth()
    const [error, setError] = useState(null)

    useEffect(() => {
        // Extraer los parámetros que el backend envió en la URL
        const token = searchParams.get('token')
        const rol = searchParams.get('rol')
        const errorParam = searchParams.get('error')

        // Si Google o el backend enviaron un error
        if (errorParam) {
            setError('Hubo un problema al iniciar sesión con Google. Intenta nuevamente.')
            setTimeout(() => navigate('/login'), 3000)
            return
        }

        // Si el token llegó correctamente
        if (token && rol) {
            // Guardar en Zustand (persiste en localStorage automáticamente)
            setToken(token)
            setRol(rol)

            // Redirigir al Dashboard
            navigate('/dashboard')
        } else {
            // Si faltan parámetros, algo salió mal
            setError('No se recibieron las credenciales de Google. Redirigiendo...')
            setTimeout(() => navigate('/login'), 3000)
        }
    }, [searchParams, navigate, setToken, setRol])

    return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
                {error ? (
                    <>
                        <div className="text-red-500 text-5xl mb-4">⚠️</div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Error de Autenticación</h2>
                        <p className="text-gray-500 text-sm">{error}</p>
                        <p className="text-gray-400 text-xs mt-4">Redirigiendo al login...</p>
                    </>
                ) : (
                    <>
                        {/* Spinner animado */}
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700 mx-auto mb-4"></div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Autenticando con Google...</h2>
                        <p className="text-gray-500 text-sm">Estamos verificando tu identidad. Serás redirigido en un momento.</p>
                    </>
                )}
            </div>
        </div>
    )
}

export default GoogleCallbackPage
