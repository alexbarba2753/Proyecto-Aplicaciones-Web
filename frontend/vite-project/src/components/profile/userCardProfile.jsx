// 🎓 ADAPTADO: Importación apuntando a tu archivo exacto userProfile
import storeProfile from "../../context/userProfile"

export const userCardProfile = () => {
    // Jalamos los datos del usuario logueado desde tu store global
    const { user } = storeProfile() 

    return (
        <div className="bg-slate-900 border border-slate-800 h-auto p-6 flex flex-col items-center justify-between shadow-2xl rounded-2xl max-w-sm mx-auto transition duration-300 hover:border-slate-700">
            
            {/* Contenedor de la Foto de Perfil */}
            <div className="relative mb-6 group">
                <img 
                    src="https://cdn-icons-png.flaticon.com/512/4715/4715329.png" 
                    alt="img-client" 
                    className="m-auto rounded-full border-4 border-slate-800 shadow-md transition duration-300 group-hover:border-slate-700" 
                    width={128} 
                    height={128} 
                />
                
                <label className="absolute bottom-1 right-1 bg-blue-600 text-white rounded-full p-2.5 cursor-pointer shadow-lg hover:bg-emerald-500 transition duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                    </svg>
                    <input type="file" accept="image/*" className="hidden" />
                </label>
            </div>

            {/* Lista de Campos de Datos */}
            <div className="w-full space-y-4 text-sm">
                
                {/* Campo Nombre */}
                <div className="flex flex-col border-b border-slate-800/60 pb-2">
                    <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">Nombre</span>
                    <p className="text-slate-200 font-medium mt-0.5">{user?.nombre || "—"}</p>
                </div>

                {/* Campo Apellido */}
                <div className="flex flex-col border-b border-slate-800/60 pb-2">
                    <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">Apellido</span>
                    <p className="text-slate-200 font-medium mt-0.5">{user?.apellido || "—"}</p>
                </div>

                {/* Campo Dirección */}
                <div className="flex flex-col border-b border-slate-800/60 pb-2">
                    <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">Dirección</span>
                    <p className="text-slate-300 font-medium mt-0.5">{user?.direccion || "—"}</p>
                </div>

                {/* Campo Celular */}
                <div className="flex flex-col border-b border-slate-800/60 pb-2">
                    <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">Celular</span>
                    <p className="text-slate-300 font-medium mt-0.5">{user?.celular || "—"}</p>
                </div>

                {/* Campo Correo Electrónico */}
                <div className="flex flex-col pb-1">
                    <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">Correo Electrónico</span>
                    <p className="text-slate-300 font-medium mt-0.5 break-all">{user?.email || "—"}</p>
                </div>
                
            </div>
        </div>
    )
}

export default userCardProfile