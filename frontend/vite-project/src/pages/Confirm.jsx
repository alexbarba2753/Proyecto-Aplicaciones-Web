import { Link, useParams } from "react-router-dom" // Corregido para Vite/React Router DOM
import { useEffect } from "react"
import { ToastContainer } from "react-toastify"
import { useFetch } from "../hooks/useFetch"

export const Confirm = () => {
    const { fetchDataBackend } = useFetch()
    const { token } = useParams()
    
    const verifyToken = async () => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/confirmar/${token}`
        await fetchDataBackend(url)
    }

    useEffect(() => {
        verifyToken()
    }, [])

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50 font-sans p-6">
            
            <ToastContainer />
            
            <div className="flex items-center justify-center h-40 w-40 rounded-full bg-green-100 text-green-600 border-4 border-solid border-green-500 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-20 h-20 animate-bounce">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </div>

            <div className="flex flex-col items-center justify-center text-center max-w-md">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-10 uppercase tracking-wide">
                    ¡Cuenta Confirmada!
                </h1>
                <p className="md:text-lg text-gray-600 mt-4 px-2">
                    Tu registro en el Sistema de Control de Prácticas de la ESFOT ha sido validado con éxito.
                </p>
                <p className="text-sm text-gray-400 mt-2">
                    Ya puedes acceder a la plataforma para gestionar tus actividades y bitácoras.
                </p>
                
                {/* Botón de redirección al Login */}
                <Link 
                    to="/login" 
                    className="mt-8 px-8 py-3 w-full text-center font-semibold bg-gray-600 text-white rounded-xl shadow-md transition duration-300 hover:scale-105 hover:bg-gray-800 hover:shadow-lg"
                >
                    Ir al Inicio de Sesión
                </Link>
            </div>
        </div>
    )
}