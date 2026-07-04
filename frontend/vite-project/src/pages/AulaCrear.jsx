import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import storeAulas from "../context/storeAulas"

const AulaCrear = () => {
    const { crearAula } = storeAulas()
    const navigate = useNavigate()
    const [enviando, setEnviando] = useState(false)
    const [aulaCreada, setAulaCreada] = useState(null)

    const { register, handleSubmit, formState: { errors } } = useForm()

    const onSubmit = async (data) => {
        setEnviando(true)
        const resultado = await crearAula(data)
        setEnviando(false)

        if (resultado) {
            // Mostramos el código generado antes de redirigir
            setAulaCreada(resultado.aula)
        }
    }

    // Si el aula fue creada, mostramos el código de acceso
    if (aulaCreada) {
        return (
            <div className="max-w-lg mx-auto mt-10">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
                    {/* Icono de éxito */}
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-emerald-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">¡Aula Creada!</h2>
                    <p className="text-slate-400 text-sm mb-6">
                        Comparte este código con tus estudiantes para que se unan al aula.
                    </p>

                    {/* Código de acceso grande */}
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
                            Código de Acceso
                        </p>
                        <p className="text-4xl font-mono font-black text-emerald-400 tracking-[0.4em]">
                            {aulaCreada.codigoAcceso}
                        </p>
                    </div>

                    {/* Botón copiar */}
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(aulaCreada.codigoAcceso)
                        }}
                        className="flex items-center gap-2 mx-auto px-5 py-2.5 rounded-xl text-white font-semibold 
                                   bg-slate-800 hover:bg-slate-700 transition text-sm mb-6 border border-slate-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                        </svg>
                        Copiar Código
                    </button>

                    {/* Botón para ir a mis aulas */}
                    <button
                        onClick={() => navigate("/dashboard/aulas")}
                        className="w-full px-5 py-3 rounded-xl text-white font-semibold 
                                   bg-gradient-to-r from-indigo-600 to-violet-600 
                                   hover:from-indigo-500 hover:to-violet-500 
                                   transition text-sm shadow-lg shadow-indigo-900/30"
                    >
                        Ir a Mis Aulas
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Botón volver */}
            <Link 
                to="/dashboard/aulas" 
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition mb-6 font-medium"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                Volver a Mis Aulas
            </Link>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Crear Nueva Aula Virtual</h1>
                <p className="text-sm text-slate-400 mt-1">
                    Configura los datos del aula. El código de acceso se generará automáticamente.
                </p>
            </div>

            {/* Formulario */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    
                    {/* Campo: Nombre del Aula */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Nombre del Aula <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Ej: Prácticas Preprofesionales 2026-A"
                            className={`w-full px-4 py-3 bg-slate-800 border rounded-xl text-white 
                                       placeholder:text-slate-600 focus:outline-none focus:ring-2 
                                       focus:ring-indigo-500 focus:border-transparent transition text-sm
                                       ${errors.nombre ? 'border-red-500' : 'border-slate-700'}`}
                            {...register("nombre", {
                                required: "El nombre del aula es obligatorio",
                                minLength: { value: 3, message: "Mínimo 3 caracteres" },
                                maxLength: { value: 80, message: "Máximo 80 caracteres" },
                                pattern: {
                                    value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s\-_.]{3,80}$/,
                                    message: "Solo se permiten letras, números, espacios, guiones y puntos"
                                }
                            })}
                        />
                        {errors.nombre && (
                            <p className="text-red-400 text-xs mt-2 font-medium">{errors.nombre.message}</p>
                        )}
                    </div>

                    {/* Campo: Nombre de la Empresa */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Nombre de la Empresa <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Ej: CNT EP, Banco Pichincha, CEDIA"
                            className={`w-full px-4 py-3 bg-slate-800 border rounded-xl text-white 
                                       placeholder:text-slate-600 focus:outline-none focus:ring-2 
                                       focus:ring-indigo-500 focus:border-transparent transition text-sm
                                       ${errors.empresa ? 'border-red-500' : 'border-slate-700'}`}
                            {...register("empresa", {
                                required: "El nombre de la empresa es obligatorio",
                                minLength: { value: 2, message: "Mínimo 2 caracteres" },
                                maxLength: { value: 100, message: "Máximo 100 caracteres" },
                                pattern: {
                                    value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s\-_.&]{2,100}$/,
                                    message: "Solo se permiten letras, números, espacios, guiones y caracteres especiales válidos"
                                }
                            })}
                        />
                        {errors.empresa && (
                            <p className="text-red-400 text-xs mt-2 font-medium">{errors.empresa.message}</p>
                        )}
                    </div>

                    {/* Campo: Descripción (opcional) */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Descripción <span className="text-slate-600 font-normal">(opcional)</span>
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Breve descripción del aula o indicaciones para los estudiantes..."
                            className={`w-full px-4 py-3 bg-slate-800 border rounded-xl text-white 
                                       placeholder:text-slate-600 focus:outline-none focus:ring-2 
                                       focus:ring-indigo-500 focus:border-transparent transition text-sm
                                       resize-none ${errors.descripcion ? 'border-red-500' : 'border-slate-700'}`}
                            {...register("descripcion", {
                                maxLength: { value: 200, message: "Máximo 200 caracteres" }
                            })}
                        />
                        {errors.descripcion && (
                            <p className="text-red-400 text-xs mt-2 font-medium">{errors.descripcion.message}</p>
                        )}
                    </div>

                    {/* Nota informativa */}
                    <div className="flex items-start gap-3 p-4 bg-indigo-950/30 border border-indigo-900/30 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                        </svg>
                        <p className="text-xs text-indigo-300/80">
                            Al crear el aula, el sistema generará automáticamente un <strong className="text-indigo-200">código de acceso único de 6 caracteres</strong> que podrás compartir con tus estudiantes para que se unan.
                        </p>
                    </div>

                    {/* Botón de envío */}
                    <button
                        type="submit"
                        disabled={enviando}
                        className="w-full px-5 py-3.5 rounded-xl text-white font-semibold 
                                   bg-gradient-to-r from-emerald-600 to-teal-600 
                                   hover:from-emerald-500 hover:to-teal-500 
                                   transition text-sm disabled:opacity-50 disabled:cursor-not-allowed 
                                   shadow-lg shadow-emerald-900/30"
                    >
                        {enviando ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                </svg>
                                Creando Aula...
                            </span>
                        ) : "Crear Aula Virtual"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AulaCrear
