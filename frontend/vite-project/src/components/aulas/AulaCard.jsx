import { Link } from "react-router-dom"

// Paleta de gradientes para que cada tarjeta tenga un color diferente
const gradientes = [
    "from-indigo-600 to-violet-700",
    "from-emerald-600 to-teal-700",
    "from-amber-600 to-orange-700",
    "from-rose-600 to-pink-700",
    "from-cyan-600 to-blue-700",
    "from-fuchsia-600 to-purple-700",
]

const AulaCard = ({ aula, index, rolUsuario, onArchivar }) => {
    // Seleccionamos un gradiente basado en el índice para variedad visual
    const gradiente = gradientes[index % gradientes.length]

    return (
        <Link
            to={`/dashboard/aulas/${aula._id}`}
            className="group block rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 
                       hover:border-slate-700 transition-all duration-300 hover:shadow-xl 
                       hover:shadow-slate-900/50 hover:-translate-y-1"
        >
            {/* Header con gradiente estilo Classroom */}
            <div className={`bg-gradient-to-br ${gradiente} p-5 relative`}>
                <h3 className="text-lg font-bold text-white truncate pr-8">
                    {aula.nombre}
                </h3>
                <p className="text-sm text-white/80 mt-1 truncate">
                    🏢 {aula.empresa}
                </p>

                {/* Avatar del docente (circular) */}
                <div className="absolute -bottom-5 right-5 w-14 h-14 rounded-full bg-slate-800 
                                border-4 border-slate-900 flex items-center justify-center 
                                text-xl font-bold text-white shadow-lg">
                    {aula.docente?.nombre?.charAt(0)?.toUpperCase() || "D"}
                </div>
            </div>

            {/* Cuerpo de la tarjeta */}
            <div className="p-5 pt-4">
                {/* Nombre del docente */}
                <p className="text-sm text-slate-400 mb-4">
                    <span className="text-slate-500">Docente:</span>{" "}
                    <span className="text-slate-300 font-medium">
                        {aula.docente?.nombre} {aula.docente?.apellido}
                    </span>
                </p>

                {/* Badges informativos */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Badge de estudiantes */}
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 
                                         bg-slate-800 px-3 py-1.5 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                            </svg>
                            {aula.estudiantes?.length || 0}
                        </span>

                        {/* Badge de código (solo visible para docente) */}
                        {rolUsuario === "docente" && (
                            <span
                                className="flex items-center gap-1.5 text-xs font-mono font-bold 
                                           text-emerald-400 bg-emerald-950/50 px-3 py-1.5 rounded-full
                                           cursor-pointer hover:bg-emerald-900/50 transition"
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    navigator.clipboard.writeText(aula.codigoAcceso)
                                    // Pequeña notificación visual
                                    e.target.textContent = "✅ Copiado"
                                    setTimeout(() => {
                                        e.target.textContent = `🔑 ${aula.codigoAcceso}`
                                    }, 1500)
                                }}
                            >
                                🔑 {aula.codigoAcceso}
                            </span>
                        )}
                    </div>

                    {/* Botón archivar (solo docente) */}
                    {rolUsuario === "docente" && onArchivar && (
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                if (window.confirm("¿Estás seguro de archivar esta aula?")) {
                                    onArchivar(aula._id)
                                }
                            }}
                            className="text-slate-500 hover:text-red-400 transition p-1.5 rounded-lg 
                                       hover:bg-red-950/30"
                            title="Archivar aula"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </Link>
    )
}

export default AulaCard
