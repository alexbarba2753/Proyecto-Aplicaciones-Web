import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useFetch } from '../hooks/useFetch'
import { ToastContainer } from 'react-toastify'

export const Reset = () => {
    const navigate = useNavigate()
    const { token } = useParams()
    const { fetchDataBackend, loading } = useFetch()
    const [tokenback, setTokenBack] = useState(false)
    const { register, handleSubmit, formState: { errors }, watch } = useForm()

    // Envia la nueva contraseña
    const changePassword = async (dataForm) => {
        // Endpoint sincronizado con tu Backend: /api/nuevopassword/:token
        const url = `${import.meta.env.VITE_BACKEND_URL}/nuevopassword/${token}`
        
        // Enviamos los datos directamente al backend
        const response = await fetchDataBackend(url, dataForm, 'POST')
        
        // Si el backend guardó con éxito la clave, redirigimos en 2 segundos
        if (response) {
            setTimeout(() => {
                navigate('/login')
            }, 2000)
        }
    }


    useEffect(() => {
        const verifyToken = async () => {
            // Endpoint sincronizado con tu Backend: /api/recuperarpassword/:token
            const url = `${import.meta.env.VITE_BACKEND_URL}/recuperarpassword/${token}`
            const response = await fetchDataBackend(url, null, 'GET')
            if (response) {
                setTokenBack(true)
            }
        }
        if (token) verifyToken()
    }, [token])

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50 font-sans p-6">
            <ToastContainer />
            
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md flex flex-col items-center border border-gray-100">
                
                {/* Icono corporativo de Llave / Seguridad */}
                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-slate-100 text-slate-700 mb-4 border border-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-gray-800 text-center uppercase tracking-wide">
                    Bienvenido Nuevamente
                </h1>
                <small className="text-gray-400 block my-2 text-sm text-center">
                    Por favor, ingrese sus nuevas credenciales de acceso
                </small>

                {tokenback ? (
                   
                    <form className="w-full mt-4 space-y-4" onSubmit={handleSubmit(changePassword)}>

                        {/* Campo nueva contraseña */}
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700">Nueva contraseña</label>
                            <input 
                                type="password" 
                                placeholder="Ingresa tu nueva contraseña"
                                className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-600 focus:outline-none focus:border-slate-600 transition"
                                {...register("password", { required: "La contraseña es obligatoria" })}
                            />
                            {errors.password && <p className="text-red-600 text-xs mt-1 font-medium">{errors.password.message}</p>}
                        </div>

                        {/* Campo repetir contraseña con validación local usando watch */}
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700">Confirmar contraseña</label>
                            <input 
                                type="password" 
                                placeholder="Repite tu contraseña"
                                className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-600 focus:outline-none focus:border-slate-600 transition"
                                {...register("confirmpassword", { 
                                    required: "La confirmación es obligatoria",
                                    validate: value => value === watch('password') || "Las contraseñas no coinciden"
                                })}
                            />
                            {errors.confirmpassword && <p className="text-red-600 text-xs mt-1 font-medium">{errors.confirmpassword.message}</p>}
                        </div>

                        {/* Botón de Envío */}
                        <div>
                            <button 
                                className="bg-slate-700 text-white font-semibold py-2.5 w-full rounded-xl mt-4 shadow-sm transition duration-300 hover:scale-102 hover:bg-slate-900 disabled:opacity-50" 
                                disabled={loading}
                            >
                                {loading ? 'Enviando...' : 'Actualizar Contraseña'}
                            </button>
                        </div>
                        
                    </form>
                ) : (
                    // Loader de espera en lo que valida el Token
                    <div className="text-amber-600 text-sm bg-amber-50 p-4 rounded-xl border border-amber-200 mt-4 text-center font-medium w-full">
                        Cargando y verificando enlace seguro...
                    </div>
                )}
            </div>
        </div>
    )
}

export default Reset