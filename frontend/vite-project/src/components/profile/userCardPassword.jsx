import { useForm } from "react-hook-form"
// 🎓 ADAPTADO: Importaciones apuntando a tus archivos y nombres exactos
import storeProfile from "../../context/userProfile"
import storeAuth from "../../context/storeAuth"
import { useNavigate } from "react-router-dom"

const userCardPassword = () => {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const { user, updatePasswordProfile } = storeProfile()
    const { clearToken } = storeAuth()
    const navigate = useNavigate()

    const updatePassword = async (dataForm) => {
        // 🎓 ADAPTADO: Apunta exactamente a tu ruta protegida de Express
        const url = `${import.meta.env.VITE_BACKEND_URL}/usuario/actualizarpassword/${user?._id}`
        const response = await updatePasswordProfile(url, dataForm)
        
        // Si el backend responde con éxito, limpiamos el token y redirigimos al login
        if (response) {
            clearToken()
            navigate('/login')
        }
    }

    return (
        <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden transition duration-300 hover:border-slate-700 mt-8">
            
            {/* Cabecera Estética */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 border-b border-slate-800 flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-100">Seguridad de la Cuenta</h3>
                    <p className="text-xs text-slate-400">Modifica tus credenciales de acceso al sistema</p>
                </div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit(updatePassword)} className="p-6 space-y-5">
                
                {/* Campo contraseña actual */}
                <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Contraseña Actual</label>
                    <input 
                        type="password" // 🔐 CORREGIDO: De "text" a "password" por seguridad
                        placeholder="••••••••••••" 
                        className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 px-3.5 text-slate-200 placeholder-slate-800 focus:border-amber-500 focus:bg-slate-950 focus:outline-none transition duration-200"
                        {...register("passwordactual", { required: "La contraseña actual es obligatoria" })}
                    />
                    {errors.passwordactual && (
                        <p className="text-red-500 text-xs mt-1.5 font-semibold pl-1">⚠️ {errors.passwordactual.message}</p>
                    )}
                </div>

                {/* Campo contraseña nueva */}
                <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Nueva Contraseña</label>
                    <input 
                        type="password" // 🔐 CORREGIDO: De "text" a "password" por seguridad
                        placeholder="Mínimo 6 caracteres" 
                        className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 px-3.5 text-slate-200 placeholder-slate-800 focus:border-amber-500 focus:bg-slate-950 focus:outline-none transition duration-200"
                        {...register("passwordnuevo", { required: "La nueva contraseña es obligatoria" })}
                    />
                    {errors.passwordnuevo && (
                        <p className="text-red-500 text-xs mt-1.5 font-semibold pl-1">⚠️ {errors.passwordnuevo.message}</p>
                    )}
                </div>

                {/* Botón de Envío */}
                <div className="pt-2">
                    <button
                        type="submit"
                        className="w-full py-3 bg-slate-800 hover:bg-amber-600 hover:text-slate-950 text-slate-200 text-xs font-bold uppercase tracking-widest rounded-xl cursor-pointer transition-all duration-300 shadow-lg active:scale-[0.99]"
                    >
                        Actualizar Contraseña
                    </button>
                    <span className="text-[10px] text-slate-500 block text-center mt-3 leading-relaxed">
                        Nota: Al cambiar tu contraseña, se cerrará tu sesión activa de forma automática por motivos de seguridad.
                    </span>
                </div>

            </form>
        </div>
    )
}

export default userCardPassword