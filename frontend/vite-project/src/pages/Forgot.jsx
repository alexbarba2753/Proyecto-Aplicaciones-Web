import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ToastContainer } from 'react-toastify'
import { useFetch } from '../hooks/useFetch'

export const Forgot = () => {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const { fetchDataBackend, loading } = useFetch()

    const sendMail = async (dataForm) => {
        // Enpoint sincronizado con tu Backend: /api/recuperarpassword
        const url = `${import.meta.env.VITE_BACKEND_URL}/recuperarpassword`
        await fetchDataBackend(url, dataForm, 'POST')
    }

    return (
        <div className="flex flex-col sm:flex-row h-screen bg-gray-50 font-sans">
            <ToastContainer />

            {/* Lado Izquierdo: Formulario */}
            <div className="w-full sm:w-1/2 h-screen bg-white flex justify-center items-center p-8">
                <div className="md:w-4/5 sm:w-full max-w-md">
                    
                    <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center uppercase text-gray-800 tracking-wide">
                        ¿Olvidaste tu contraseña?
                    </h1>
                    <p className="text-gray-500 text-center mb-6 text-sm">
                        Ingresa tu correo institucional y te enviaremos un enlace seguro para restablecer tu acceso.
                    </p>

                    <form onSubmit={handleSubmit(sendMail)} className="space-y-4">
                        {/* Campo correo electrónico */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">Correo Electrónico</label>
                            <input 
                                type="email" 
                                placeholder="ejemplo@epn.edu.ec" 
                                className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-600 focus:outline-none focus:border-slate-600 transition"
                                {...register("email", { required: "El correo electrónico es obligatorio" })}
                            />
                            {errors.email && <p className="text-red-600 text-xs mt-1 font-medium">{errors.email.message}</p>}
                        </div>

                        {/* Botón de Envío */}
                        <div>
                            <button 
                                className="bg-slate-700 text-white font-semibold py-2.5 w-full rounded-xl mt-4 shadow-sm transition duration-300 hover:scale-102 hover:bg-slate-900 disabled:opacity-50" 
                                disabled={loading}
                            >
                                {loading ? 'Enviando enlace...' : 'Enviar Correo de Recuperación'} 
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-xs border-b border-gray-200 py-2 "/>

                    {/* Enlace para volver al Login */}
                    <div className="mt-6 text-sm flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <p className="text-gray-600 font-medium">¿Ya posees una cuenta?</p>
                        <Link 
                            to="/login" 
                            className="py-2 px-4 bg-white text-gray-700 font-semibold border border-gray-300 rounded-xl shadow-sm transition duration-300 hover:scale-105 hover:bg-gray-800 hover:text-white hover:border-gray-800"
                        >
                            Iniciar Sesión
                        </Link>
                    </div>

                </div>
            </div>

            {/* Lado Derecho: Imagen Institucional Banner */}
            <div className="w-full sm:w-1/2 h-1/3 sm:h-screen bg-gradient-to-br from-slate-800 to-slate-950 flex flex-col justify-center items-center text-white p-12 sm:block hidden">
                <div className="h-full flex flex-col justify-center items-start max-w-md mx-auto">
                    <span className="bg-slate-700 text-slate-300 text-xs uppercase px-3 py-1 rounded-full font-bold tracking-wider mb-4">
                        PracticasPPoli
                    </span>
                    <h2 className="text-4xl font-extrabold mb-4 leading-tight">
                        Sistema de Gestión de Prácticas Preprofesionales
                    </h2>
                    <p className="text-slate-400 text-lg">
                        Valida tus actividades, administra tus bitácoras y mantén el control de tus pasantías en un solo lugar corporativo.
                    </p>
                </div>
            </div>
        </div>
    )
}