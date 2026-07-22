import { useState } from "react"
import { MdVisibility, MdVisibilityOff } from "react-icons/md"
import { Link, useNavigate } from "react-router-dom" // Estandarizado a react-router-dom
import { useFetch } from '../hooks/useFetch'
import { ToastContainer } from 'react-toastify'
import { useForm } from 'react-hook-form'
import storeAuth from "../context/storeAuth"

const Login = () => {
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const { fetchDataBackend, loading } = useFetch()
    const {setToken, setRol} = storeAuth()

    // Lógica de autenticación
   const loginUser = async (dataForm) => {

        const url = `${import.meta.env.VITE_BACKEND_URL}/usuario/login`
        
        
        const response = await fetchDataBackend(url, dataForm, 'POST')
        
        // Evaluamos estrictamente que la respuesta exista
        if (response) {
            setToken(response.token)
            setRol(response.rol)
            navigate('/dashboard')
        } else {
            console.log("El backend no devolvió un token válido.")
        }
    }

    return (
        <div className="flex flex-col sm:flex-row h-screen bg-gray-50 font-sans">
            <ToastContainer />

            {/* Lado Izquierdo: Banner Corporativo de PraxisFlow (Reemplaza a doglogin.jpg) */}
            <div className="hidden sm:flex sm:w-1/2 bg-gradient-to-br from-slate-800 to-slate-950 flex-col justify-center items-start p-12 text-white">
                <div className="max-w-md mx-auto h-full flex flex-col justify-center">
                    <span className="bg-slate-700 text-slate-300 text-xs uppercase px-3 py-1 rounded-full font-bold tracking-wider mb-4 w-max">
                        Portal Institucional
                    </span>
                    <h2 className="text-4xl font-extrabold mb-4 leading-tight">
                        PraxisFlow
                    </h2>
                    <p className="text-slate-400 text-lg">
                        Inicia sesión para registrar tus bitácoras, gestionar el seguimiento de tus horas y validar tus prácticas preprofesionales ESFOT.
                    </p>
                </div>
            </div>

            {/* Lado Derecho: Formulario de Login */}
            <div className="w-full sm:w-1/2 flex justify-center items-center bg-white p-8">
                <div className="w-full max-w-md">

                    <h1 className="text-3xl font-bold text-gray-800 text-center uppercase tracking-wide">
                        Bienvenido(a)
                    </h1>
                    <p className="text-gray-400 text-center mt-2 mb-6 text-sm">
                        Por favor, ingresa tus credenciales institucionales
                    </p>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit(loginUser)} className="space-y-4">

                        {/* Campo Correo */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Correo Electrónico</label>
                            <input
                                type="email"
                                placeholder="ejemplo@epn.edu.ec"
                                className="w-full rounded-lg border border-gray-300 focus:outline-none focus:border-slate-600 px-3 py-2 text-gray-600 transition"
                                {...register("email", { required: "El correo es obligatorio" })}
                            />
                            {errors.email && <p className="text-red-600 text-xs mt-1 font-medium">{errors.email.message}</p>}
                        </div>

                        {/* Campo Contraseña */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="************"
                                    className="w-full rounded-lg border border-gray-300 focus:outline-none focus:border-slate-600 px-3 py-2 pr-10 text-gray-600 transition"
                                    {...register("password", { required: "La contraseña es obligatoria" })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-600 text-xs mt-1 font-medium">{errors.password.message}</p>}
                        </div>

                        {/* Botón Login */}
                        <div>
                            <button 
                                type="submit"
                                className="py-2.5 w-full block text-center bg-slate-700 text-white font-semibold rounded-xl shadow-sm transition duration-300 hover:scale-102 hover:bg-slate-900 disabled:opacity-50" 
                                disabled={loading}
                            >
                                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                            </button>
                        </div>

                    </form>

                    {/* Separador */}
                    <div className="mt-6 flex items-center text-gray-300">
                        <hr className="flex-1 border-gray-200" />
                        <span className="px-3 text-xs uppercase text-gray-400 font-bold">O</span>
                        <hr className="flex-1 border-gray-200" />
                    </div>

                    {/* Botón Google — Redirige al flujo OAuth del backend */}
                    <a
                        href={`${import.meta.env.VITE_BACKEND_URL}/auth/google`}
                        className="w-full mt-4 flex items-center justify-center border border-gray-300 py-2 rounded-xl text-sm font-medium text-gray-600 transition duration-300 hover:bg-gray-50"
                    >
                        <img className="w-5 mr-2" src="https://cdn-icons-png.flaticon.com/512/281/281764.png" alt="Google Logo" />
                        Ingresar con Google
                    </a>

                    {/* Enlace para olvidaste tu contraseña */}
                    <div className="mt-6 text-center text-sm border-t border-gray-100 pt-4">
                        <Link to="/forgot" className="text-slate-600 font-medium hover:underline">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    {/* Enlaces para volver o registrarse */}
                    <div className="mt-4 flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm">
                        <Link to="/" className="text-gray-500 font-medium hover:underline">Regresar al Home</Link>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">¿No tienes cuenta?</span>
                            <Link to="/register" className="font-bold text-slate-700 hover:underline">Registrarse</Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;