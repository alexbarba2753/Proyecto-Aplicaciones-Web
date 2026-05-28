import { useEffect } from "react"
import storeProfile from "../../context/userProfile"
import { useForm } from "react-hook-form"
import { ToastContainer } from 'react-toastify'

const UserFormularioPerfil = () => {
    const { user, updateProfile } = storeProfile()
    const { register, handleSubmit, reset, formState: { errors } } = useForm()

    const updateUser = (dataForm) => {
        // 🎓 ADAPTADO: URL de tu backend en Express
        const url = `${import.meta.env.VITE_BACKEND_URL}/usuario/actualizarperfil/${user?._id}`
        updateProfile(url, dataForm)
    }

    useEffect(() => {
        if (user) {
            reset({
                nombre: user?.nombre,
                apellido: user?.apellido,
                direccion: user?.direccion,
                celular: user?.celular,
                email: user?.email,
            })
        }
    }, [user])

    return (
        <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden transition duration-300 hover:border-slate-700">
            <ToastContainer />
            
            <div className="flex flex-col md:flex-row">
                
                {/* SECCIÓN IZQUIERDA: Panel Estético / Informativo */}
                <div className="md:w-1/3 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
                    <div>
                        <div className="h-8 w-8 rounded-lg bg-blue-600/10 border border-blue-500/30 flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-blue-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-extrabold tracking-tight text-slate-100">Datos Personales</h3>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                            Mantén tu información actualizada para asegurar la correcta gestión de tus procesos pre-profesionales y notificaciones del sistema.
                        </p>
                    </div>

                    <div className="mt-8 pt-4 border-t border-slate-800/60 hidden md:block">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Seguridad del Servidor</span>
                        <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 mt-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            Conexión cifrada SSL
                        </span>
                    </div>
                </div>


                <form onSubmit={handleSubmit(updateUser)} className="flex-1 p-8 space-y-5">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Campo Nombre */}
                        <div>
                            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Nombre</label>
                            <input 
                                type="text" 
                                placeholder="Tu nombre" 
                                className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 px-3.5 text-slate-200 placeholder-slate-700 focus:border-blue-600 focus:bg-slate-950 focus:outline-none transition duration-200"
                                {...register("nombre", { required: "El nombre es obligatorio" })}
                            />
                            {errors.nombre && <p className="text-red-500 text-xs mt-1.5 font-semibold pl-1">⚠️ {errors.nombre.message}</p>}
                        </div>
                    
                        {/* Campo Apellido */}
                        <div>
                            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Apellido</label>
                            <input 
                                type="text" 
                                placeholder="Tu apellido" 
                                className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 px-3.5 text-slate-200 placeholder-slate-700 focus:border-blue-600 focus:bg-slate-950 focus:outline-none transition duration-200"
                                {...register("apellido", { required: "El apellido es obligatorio" })}
                            />
                            {errors.apellido && <p className="text-red-500 text-xs mt-1.5 font-semibold pl-1">⚠️ {errors.apellido.message}</p>}
                        </div>
                    </div>

                    {/* Campo Dirección */}
                    <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Dirección Domiciliaria</label>
                        <input 
                            type="text" 
                            placeholder="Ej. Calderón, Quito" 
                            className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 px-3.5 text-slate-200 placeholder-slate-700 focus:border-blue-600 focus:bg-slate-950 focus:outline-none transition duration-200"
                            {...register("direccion", { required: "La dirección es obligatoria" })}
                        />
                        {errors.direccion && <p className="text-red-500 text-xs mt-1.5 font-semibold pl-1">⚠️ {errors.direccion.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Campo Celular */}
                        <div>
                            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Número Celular</label>
                            <input 
                                type="text" 
                                inputMode="tel" 
                                placeholder="Ej. 09XXXXXXXX" 
                                className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 px-3.5 text-slate-200 placeholder-slate-700 focus:border-blue-600 focus:bg-slate-950 focus:outline-none transition duration-200"
                                {...register("celular", { required: "El celular es obligatorio" })}
                            />
                            {errors.celular && <p className="text-red-500 text-xs mt-1.5 font-semibold pl-1">⚠️ {errors.celular.message}</p>}
                        </div>
                    
                        {/* Campo Correo Electrónico */}
                        <div>
                            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Correo Institucional</label>
                            <input 
                                type="email" 
                                placeholder="usuario@epn.edu.ec" 
                                className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 px-3.5 text-slate-200 placeholder-slate-700 focus:border-blue-600 focus:bg-slate-950 focus:outline-none transition duration-200"
                                {...register("email", { required: "El correo es obligatorio" })}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1.5 font-semibold pl-1">⚠️ {errors.email.message}</p>}
                        </div>
                    </div>

                    {/* Botón de Envío Estilizado */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl cursor-pointer transition shadow-lg shadow-blue-950/20 active:scale-[0.99]"
                        >
                            Guardar Cambios
                        </button>
                    </div>
                </form>

            </div>
        </div>
    )
}

export default UserFormularioPerfil