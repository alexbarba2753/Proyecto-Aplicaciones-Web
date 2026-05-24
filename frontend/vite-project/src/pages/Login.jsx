import { useState } from "react"
import { MdVisibility, MdVisibilityOff } from "react-icons/md"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { ToastContainer } from 'react-toastify'
import { useFetch } from "../hooks/useFetch"

export const Login = () => {
    const [showPassword, setShowPassword] = useState(false)
    const { fetchDataBackend, loading } = useFetch()
    const { register, handleSubmit, formState: { errors } } = useForm()

    const loginUser = async (dataForm) => {
        // Usamos el endpoint exacto de tu backend: /usuario/login
        const url = `${import.meta.env.VITE_BACKEND_URL}/usuario/login`
        const response = await fetchDataBackend(url, dataForm, "POST")
        
        if (response) {
            console.log("Usuario autenticado con éxito:", response)
            // Aquí guardaremos el token en el contexto global más adelante
        }
    }

    return (
        <div className="flex flex-col sm:flex-row h-screen font-sans">
            <ToastContainer />

            {/* Panel Izquierdo: Formulario */}
            <div className="w-full sm:w-1/2 h-screen bg-white flex justify-center items-center p-6">
                <div className="md:w-4/5 w-full">
                    <h1 className="text-3xl font-semibold mb-2 text-center uppercase text-gray-600">PracticasPPoli</h1>
                    <small className="text-gray-400 block my-4 text-sm text-center">
                        Gestión de Prácticas Preprofesionales ESFOT - Iniciar Sesión
                    </small>

                    <form onSubmit={handleSubmit(loginUser)} className="space-y-4">
                        {/* Campo Correo */}
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700">Correo Institucional</label>
                            <input 
                                type="email" 
                                placeholder="ejemplo@epn.edu.ec" 
                                className="block w-full rounded-md border border-gray-300 py-1.5 px-3 text-gray-600 focus:outline-gray-400"
                                {...register("email", { required: "El correo es obligatorio" })}
                            />
                            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
                        </div>

                        {/* Campo Contraseña */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-sm font-semibold text-gray-700">Contraseña</label>
                                <Link to="/forgot" className="text-xs text-gray-500 hover:underline">¿Olvidaste tu contraseña?</Link>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="************"
                                    className="w-full rounded-md border border-gray-300 px-3 py-1.5 pr-10 text-gray-600 focus:outline-gray-400"
                                    {...register("password", { required: "La contraseña es obligatoria" })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>}
                        </div>

                        {/* Botón Ingresar */}
                        <div>
                            <button 
                                type="submit" 
                                className="bg-gray-600 text-white py-2 w-full rounded-md mt-2 font-semibold shadow-md hover:bg-gray-700 transition duration-300"
                                disabled={loading}
                            >
                                {loading ? "Verificando..." : "Ingresar al Sistema"}
                            </button>
                        </div>
                    </form>

                    {/* Enlace al Registro */}
                    <div className="mt-6 text-sm flex justify-between items-center text-gray-600">
                        <p>¿Eres nuevo en el sistema o vas a Iniciar ya tus practicas?</p>
                        <Link to="/register" className="py-1.5 px-4 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition duration-300">
                            Crea un Nuevo Usuario
                        </Link>
                    </div>
                </div>
            </div>

            {/* Panel Derecho: Mensaje Institucional */}
            <div className="w-full sm:w-1/2 h-1/3 sm:h-screen bg-gradient-to-br from-gray-800 to-gray-950 sm:flex hidden flex-col justify-center items-center text-white p-12">
                <h2 className="text-4xl font-bold mb-4">ESFOT EPN</h2>
                <p className="text-center text-gray-300 max-w-sm">
                    Accede a tu panel para gestionar tus bitácoras, registrar actividades y validar tus horas de prácticas.
                </p>
            </div>
        </div>
    )
}