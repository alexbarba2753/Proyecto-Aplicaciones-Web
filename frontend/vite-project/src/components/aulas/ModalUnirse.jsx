import { useState } from "react"
import { useForm } from "react-hook-form"
import storeAulas from "../../context/storeAulas"

const ModalUnirse = ({ isOpen, onClose }) => {
    const { unirseAula } = storeAulas()
    const [enviando, setEnviando] = useState(false)

    const { register, handleSubmit, reset, formState: { errors } } = useForm()

    const onSubmit = async (data) => {
        setEnviando(true)
        const exito = await unirseAula(data.codigoAcceso)
        setEnviando(false)
        
        if (exito) {
            reset()
            onClose()
        }
    }

    // Si el modal no está abierto, no renderizamos nada
    if (!isOpen) return null

    return (
        // Overlay oscuro con blur
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            {/* Contenedor del modal */}
            <div 
                className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-md 
                           shadow-2xl shadow-black/40 animate-[fadeIn_0.2s_ease-out]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header del modal */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-white">
                            Unirse a un Aula
                        </h2>
                        <p className="text-sm text-slate-400 mt-1">
                            Ingresa el código de acceso proporcionado por tu docente
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-white transition p-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Código de Acceso
                        </label>
                        <input
                            type="text"
                            placeholder="Ej: A1B2C3"
                            maxLength={6}
                            className={`w-full px-4 py-3 bg-slate-800 border rounded-xl text-white 
                                       text-center text-2xl font-mono font-bold tracking-[0.3em] 
                                       placeholder:text-slate-600 placeholder:text-base placeholder:tracking-normal
                                       placeholder:font-normal
                                       focus:outline-none focus:ring-2 focus:ring-indigo-500 
                                       focus:border-transparent transition uppercase
                                       ${errors.codigoAcceso ? 'border-red-500' : 'border-slate-700'}`}
                            {...register("codigoAcceso", {
                                required: "El código de acceso es obligatorio",
                                pattern: {
                                    value: /^[A-Za-z0-9]{6}$/,
                                    message: "El código debe tener exactamente 6 caracteres alfanuméricos"
                                },
                                minLength: {
                                    value: 6,
                                    message: "El código debe tener 6 caracteres"
                                },
                                maxLength: {
                                    value: 6,
                                    message: "El código debe tener 6 caracteres"
                                }
                            })}
                        />
                        {errors.codigoAcceso && (
                            <p className="text-red-400 text-xs mt-2 font-medium">
                                {errors.codigoAcceso.message}
                            </p>
                        )}
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => { reset(); onClose() }}
                            className="flex-1 px-4 py-3 rounded-xl text-slate-400 font-semibold 
                                       bg-slate-800 hover:bg-slate-700 transition text-sm"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={enviando}
                            className="flex-1 px-4 py-3 rounded-xl text-white font-semibold 
                                       bg-gradient-to-r from-indigo-600 to-violet-600 
                                       hover:from-indigo-500 hover:to-violet-500 
                                       transition text-sm disabled:opacity-50 
                                       disabled:cursor-not-allowed shadow-lg shadow-indigo-900/30"
                        >
                            {enviando ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                    </svg>
                                    Uniéndose...
                                </span>
                            ) : "Unirme al Aula"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ModalUnirse
