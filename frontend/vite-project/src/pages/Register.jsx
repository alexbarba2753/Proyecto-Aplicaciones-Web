import { useState } from "react"
import { MdVisibility, MdVisibilityOff } from "react-icons/md"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { ToastContainer, toast } from 'react-toastify' // Manteniendo Toastify aquí mismo
import { useFetch } from "../hooks/useFetch"
import axios from "axios"

export const Register = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [verifyingCedula, setVerifyingCedula] = useState(false)
    const [isVerified, setIsVerified] = useState(false)
    const { fetchDataBackend, loading } = useFetch()
    const { register, handleSubmit, formState: { errors }, getValues, setValue } = useForm()

    const registerUser = async (dataForm) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/registro`
        await fetchDataBackend(url, dataForm, "POST")
    }

    const handleVerifyCedula = async () => {
        const cedula = getValues("cedula")
        
        if (!cedula || cedula.length !== 10) {
            toast.warning("Ingresa una cédula válida de 10 dígitos primero")
            return
        }

        try {
            setVerifyingCedula(true)
            const url = `${import.meta.env.VITE_BACKEND_URL}/usuario/verificar-cedula/${cedula}`
            const response = await axios.get(url)
            
            if (response.data.nombre) {
                setValue("nombre", response.data.nombre, { shouldValidate: true })
            }
            if (response.data.apellido) {
                setValue("apellido", response.data.apellido, { shouldValidate: true })
            }
            
            setIsVerified(true)
            toast.success("Cédula verificada con éxito")
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al verificar la cédula")
        } finally {
            setVerifyingCedula(false)
        }
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

                        {/* Campo Cédula */}
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700">Cédula</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Ingresa tu cédula (10 dígitos)"
                                    className="block w-full rounded-md border border-gray-300 py-1.5 px-3 text-gray-600 focus:outline-gray-400"
                                    {...register("cedula", {
                                        required: "La cédula es obligatoria para el registro local",
                                        pattern: {
                                            value: /^[0-9]{10}$/,
                                            message: "La cédula debe tener exactamente 10 dígitos numéricos"
                                        },
                                        onChange: () => setIsVerified(false)
                                    })}
                                />
                                <button
                                    type="button"
                                    onClick={handleVerifyCedula}
                                    disabled={verifyingCedula}
                                    className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-1.5 rounded-md text-sm font-medium transition disabled:opacity-50 whitespace-nowrap"
                                >
                                    {verifyingCedula ? "Verificando..." : "Verificar"}
                                </button>
                            </div>
                            {errors.cedula && <p className="text-red-600 text-xs mt-1">{errors.cedula.message}</p>}
                        </div>

                        {/* Campo nombre */}
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700">Nombre</label>
                            <input
                                type="text"
                                placeholder="Ingresa tu nombre"
                                readOnly={isVerified}
                                className={`block w-full rounded-md border border-gray-300 py-1.5 px-3 focus:outline-gray-400 ${isVerified ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'text-gray-600'}`}
                                {...register("nombre", {
                                    required: "El nombre es obligatorio",
                                    pattern: {
                                        value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                                        message: "El nombre solo puede contener letras y espacios"
                                    },
                                    minLength: { value: 2, message: "El nombre debe tener al menos 2 caracteres" },
                                    maxLength: { value: 15, message: "El nombre no puede exceder los 15 caracteres" }
                                })}
                            />
                            {errors.nombre && <p className="text-red-600 text-xs mt-1">{errors.nombre.message}</p>}
                        </div>

                        {/* Campo apellido */}
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700">Apellido</label>
                            <input
                                type="text"
                                placeholder="Ingresa tu apellido"
                                readOnly={isVerified}
                                className={`block w-full rounded-md border border-gray-300 py-1.5 px-3 focus:outline-gray-400 ${isVerified ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'text-gray-600'}`}
                                {...register("apellido", {
                                    required: "El apellido es obligatorio",
                                    pattern: {
                                        value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                                        message: "El apellido solo puede contener letras y espacios"
                                    },
                                    minLength: { value: 2, message: "El apellido debe tener al menos 2 caracteres" },
                                    maxLength: { value: 15, message: "El apellido no puede exceder los 15 caracteres" }
                                })}
                            />
                            {errors.apellido && <p className="text-red-600 text-xs mt-1">{errors.apellido.message}</p>}
                        </div>

                        {/* Campo celular */}
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700">Celular</label>
                            <input
                                type="text"
                                inputMode="tel"
                                placeholder="Ej: 0987654321"
                                className="block w-full rounded-md border border-gray-300 py-1.5 px-3 text-gray-600 focus:outline-gray-400"
                                {...register("celular", {
                                    required: "El celular es obligatorio",
                                    pattern: {
                                        value: /^[0-9]+$/,
                                        message: "El celular solo puede contener números sin espacios ni letras"
                                    },
                                    maxLength: { value: 10, message: "El celular no puede exceder los 10 dígitos" },
                                    minLength: { value: 9, message: "El celular debe tener al menos 9 dígitos" }
                                })}
                            />
                            {errors.celular && <p className="text-red-600 text-xs mt-1">{errors.celular.message}</p>}
                        </div>

                        {/* Campo correo electrónico */}
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700">Correo institucional</label>
                            <input
                                type="email"
                                placeholder="ejemplo@epn.edu.ec"
                                className="block w-full rounded-md border border-gray-300 py-1.5 px-3 text-gray-600 focus:outline-gray-400"
                                {...register("email", { required: "El correo electrónico es obligatorio" })}
                            />
                            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
                        </div>

                        {/* Campo Rol del Sistema */}
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700">Tipo de Usuario (Rol)</label>
                            <select
                                className="block w-full rounded-md border border-gray-300 py-1.5 px-3 bg-white text-gray-600 focus:outline-gray-400"
                                {...register("rol", { required: "Debes seleccionar tu rol institucional" })}
                            >
                                <option value="">-- Selecciona tu Rol --</option>
                                <option value="Estudiante">Estudiante</option>
                                <option value="Docente">Docente</option>
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
                                    onMouseDown={() => setShowPassword(true)}
                                    onMouseUp={() => setShowPassword(false)}
                                    onMouseLeave={() => setShowPassword(false)}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                                    title="Mantén presionado para ver la contraseña"
                                >
                                    {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>}
                        </div>

                        {/* Botón enviar */}
                        <div>
                            <button
                                className="bg-gray-600 text-white py-2 w-full rounded-md mt-4 font-semibold shadow-md hover:bg-gray-700 transition duration-300"
                                disabled={loading}
                            >
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