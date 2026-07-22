import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { ToastContainer, toast } from 'react-toastify'
import { useFetch } from "../hooks/useFetch"
import storeAuth from "../context/storeAuth"
import storeProfile from "../context/userProfile"
import axios from "axios"

export const CompletarPerfil = () => {
    const [verifyingCedula, setVerifyingCedula] = useState(false)
    const { fetchDataBackend, loading } = useFetch()
    const { register, handleSubmit, formState: { errors }, getValues, setValue } = useForm()
    const navigate = useNavigate()
    const { token, setRol } = storeAuth()
    const { profile } = storeProfile()

    useEffect(() => {
        if (!token) {
            navigate('/login')
        }
    }, [token, navigate])

    const submitPerfil = async (dataForm) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/usuario/completar-perfil`
        const response = await fetchDataBackend(url, dataForm, "PUT", {
            Authorization: `Bearer ${token}`
        })
        
        if (response?.msg === "Perfil completado exitosamente") {
            // Actualizamos el rol en el estado global
            if (response.rol) {
                setRol(response.rol)
            }
            // 🎓 Forzamos a que vuelva a descargar la info del usuario
            await profile()
            
            toast.success("Perfil completado. Redirigiendo al Dashboard...")
            setTimeout(() => {
                navigate('/dashboard')
            }, 2000)
        }
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
            
            toast.success("Cédula verificada. Puedes modificar tu nombre si lo deseas.")
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al verificar la cédula")
        } finally {
            setVerifyingCedula(false)
        }
    }

    return (
        <div className="flex flex-col sm:flex-row h-screen font-sans">
            <ToastContainer />

            {/* Contenedor del Formulario */}
            <div className="w-full sm:w-1/2 h-screen bg-white flex justify-center items-center p-6 overflow-y-auto">
                <div className="md:w-4/5 w-full">
                    <h1 className="text-3xl font-semibold mb-2 text-center uppercase text-gray-600">Completa tu Perfil</h1>
                    <small className="text-gray-400 block my-4 text-sm text-center">
                        Para continuar usando el sistema, por favor proporciona los siguientes datos.
                    </small>

                    <form onSubmit={handleSubmit(submitPerfil)} className="space-y-3">

                        {/* Campo Cédula */}
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700">Cédula</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Ingresa tu cédula (10 dígitos)"
                                    className="block w-full rounded-md border border-gray-300 py-1.5 px-3 text-gray-600 focus:outline-gray-400"
                                    {...register("cedula", {
                                        required: "La cédula es obligatoria",
                                        pattern: {
                                            value: /^[0-9]{10}$/,
                                            message: "La cédula debe tener exactamente 10 dígitos numéricos"
                                        }
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
                                placeholder="Tus nombres"
                                className="block w-full rounded-md border border-gray-300 py-1.5 px-3 text-gray-600 focus:outline-gray-400"
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
                                placeholder="Tus apellidos"
                                className="block w-full rounded-md border border-gray-300 py-1.5 px-3 text-gray-600 focus:outline-gray-400"
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

                        {/* Botón enviar */}
                        <div>
                            <button
                                className="bg-gray-600 text-white py-2 w-full rounded-md mt-4 font-semibold shadow-md hover:bg-gray-700 transition duration-300"
                                disabled={loading}
                            >
                                {loading ? "Guardando..." : "Guardar y Continuar"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Panel Lateral Derecho */}
            <div className="w-full sm:w-1/2 h-1/3 sm:h-screen bg-gradient-to-tr from-gray-700 to-gray-900 sm:flex hidden flex-col justify-center items-center text-white p-12">
                <h2 className="text-4xl font-bold mb-4">¡Casi listo!</h2>
                <p className="text-center text-gray-300 max-w-sm">
                    Solo necesitamos unos datos adicionales para configurar tu cuenta correctamente.
                </p>
            </div>
        </div>
    )
}
