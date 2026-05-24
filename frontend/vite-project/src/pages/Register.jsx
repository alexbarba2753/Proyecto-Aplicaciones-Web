import { useState } from "react"
import { MdVisibility, MdVisibilityOff } from "react-icons/md"
import { Link } from "react-router-dom" 
import { useForm } from "react-hook-form"
import { ToastContainer } from 'react-toastify' // Manteniendo Toastify aquí mismo
import { useFetch } from "../hooks/useFetch"

export const Register = () => {
    const [showPassword, setShowPassword] = useState(false)
    const { fetchDataBackend, loading } = useFetch()
    const { register, handleSubmit, formState: { errors } } = useForm()
    
    const registerUser = async (dataForm) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/registro`
        await fetchDataBackend(url, dataForm, "POST")
    }

    return (
        <div className="flex flex-col sm:flex-row h-screen font-sans">
            {/* Tu Toast Container se queda exactamente aquí */}
            <ToastContainer />

            {/* Contenedor del Formulario */}
            <div className="w-full sm:w-1/2 h-screen bg-white flex justify-center items-center p-6 overflow-y-auto">
                <div className="md:w-4/5 w-full">
                    <h1 className="text-3xl font-semibold mb-2 text-center uppercase text-gray-600">PracticasPPoli</h1>
                    <small className="text-gray-400 block my-4 text-sm text-center">
                        Formulario de Registro - Control de Prácticas ESFOT
                    </small> 
                    
                    <form onSubmit={handleSubmit(registerUser)} className="space-y-3">
                        {/* Campo nombre */}
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700">Nombre</label>
                            <input type="text" placeholder="Ingresa tu nombre" className="block w-full rounded-md border border-gray-300 py-1.5 px-3 text-gray-600 focus:outline-gray-400"
                            {...register("nombre", { required: "El nombre es obligatorio" })}
                            />
                            {errors.nombre && <p className="text-red-600 text-xs mt-1">{errors.nombre.message}</p>}
                        </div>

                        {/* Campo apellido */}
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700">Apellido</label>
                            <input type="text" placeholder="Ingresa tu apellido" className="block w-full rounded-md border border-gray-300 py-1.5 px-3 text-gray-600 focus:outline-gray-400"
                            {...register("apellido", { required: "El apellido es obligatorio" })}
                            />
                            {errors.apellido && <p className="text-red-600 text-xs mt-1">{errors.apellido.message}</p>}
                        </div>

                        {/* Campo celular */}
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700">Celular</label>
                            <input type="text" inputMode="tel" placeholder="Ej: 0987654321" className="block w-full rounded-md border border-gray-300 py-1.5 px-3 text-gray-600 focus:outline-gray-400"
                            {...register("celular", { required: "El celular es obligatorio" })}
                            />
                            {errors.celular && <p className="text-red-600 text-xs mt-1">{errors.celular.message}</p>}
                        </div>

                        {/* Campo correo electrónico */}
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700">Correo institucional</label>
                            <input type="email" placeholder="ejemplo@epn.edu.ec" className="block w-full rounded-md border border-gray-300 py-1.5 px-3 text-gray-600 focus:outline-gray-400" 
                            {...register("email", { required: "El correo electrónico es obligatorio" })}
                            />
                            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
                        </div>

                        {/* Campo Rol del Sistema (Obligatorio para el Backend) */}
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700">Tipo de Usuario (Rol)</label>
                            <select 
                                className="block w-full rounded-md border border-gray-300 py-1.5 px-3 bg-white text-gray-600 focus:outline-gray-400"
                                {...register("rol", { required: "Debes seleccionar tu rol institucional" })}
                            >
                                <option value="">-- Selecciona tu Rol --</option>
                                <option value="Estudiante">Estudiante</option>
                                <option value="Tutor">Tutor Académico</option>
                                <option value="Supervisor">Supervisor de Prácticas</option>
                            </select>
                            {errors.rol && <p className="text-red-600 text-xs mt-1">{errors.rol.message}</p>}
                        </div>

                        {/* Campo Contraseña */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
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

                        {/* Botón enviar */}
                        <div>
                            <button className="bg-gray-600 text-white py-2 w-full rounded-md mt-4 font-semibold shadow-md hover:bg-gray-700 transition duration-300"
                            disabled={loading}>
                                {loading ? "Procesando..." : "Registrarse"}
                            </button>
                        </div>
                    </form>

                    {/* Enlace al Login */}
                    <div className="mt-5 text-sm flex justify-between items-center text-gray-600">
                        <p>¿Ya tienes una cuenta?</p>
                        <Link to="/login" className="py-1.5 px-4 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition duration-300">
                            Iniciar sesión
                        </Link>
                    </div>
                </div>
            </div>

            {/* Panel Lateral Derecho */}
            <div className="w-full sm:w-1/2 h-1/3 sm:h-screen bg-gradient-to-tr from-gray-700 to-gray-900 sm:flex hidden flex-col justify-center items-center text-white p-12">
                <h2 className="text-4xl font-bold mb-4">ESFOT</h2>
                <p className="text-center text-gray-300 max-w-sm">
                    Sistema Automatizado para el Registro de Actividades y Generación de Bitácoras.
                </p>
            </div>
        </div>
    )
}