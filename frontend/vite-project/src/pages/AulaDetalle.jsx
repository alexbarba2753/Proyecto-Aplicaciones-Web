import { useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import storeAulas from "../context/storeAulas"
import storeAuth from "../context/storeAuth"

const AulaDetalle = () => {
    const { id } = useParams()
    const { aulaSeleccionada, cargando, fetchAulaDetalle, limpiarAulaSeleccionada } = storeAulas()
    const { rol } = storeAuth()

    useEffect(() => {
        fetchAulaDetalle(id)
        // Limpiar al desmontar el componente
        return () => limpiarAulaSeleccionada()
    }, [id])

    // Estado de carga
    if (cargando || !aulaSeleccionada) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="flex items-center gap-3 text-slate-400">
                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    <span className="font-medium">Cargando aula...</span>
                </div>
            </div>
        )
    }

    const aula = aulaSeleccionada

    return (
        <div>
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

            {/* Header del Aula */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-8 mb-8 relative overflow-hidden">
                {/* Patrón decorativo */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold text-white mb-2">{aula.nombre}</h1>
                    <p className="text-indigo-100 flex items-center gap-2 text-lg">
                        🏢 {aula.empresa}
                    </p>
                    {aula.descripcion && (
                        <p className="text-indigo-200/80 mt-3 text-sm max-w-2xl">{aula.descripcion}</p>
                    )}

                    {/* Info del docente y código */}
                    <div className="flex items-center gap-6 mt-6 flex-wrap">
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold text-white">
                                {aula.docente?.nombre?.charAt(0)?.toUpperCase()}
                            </div>
                            <div>
                                <p className="text-xs text-indigo-200 font-medium">Docente</p>
                                <p className="text-white font-semibold text-sm">
                                    {aula.docente?.nombre} {aula.docente?.apellido}
                                </p>
                            </div>
                        </div>

                        {/* Código de acceso (visible para docentes) */}
                        {rol === "docente" && (
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(aula.codigoAcceso)
                                }}
                                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 
                                           hover:bg-white/20 transition cursor-pointer group"
                                title="Clic para copiar el código"
                            >
                                <span className="text-xs text-indigo-200 font-medium">Código</span>
                                <span className="text-white font-mono font-bold text-lg tracking-wider">
                                    {aula.codigoAcceso}
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" 
                                     className="w-4 h-4 text-indigo-200 group-hover:text-white transition">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                                </svg>
                            </button>
                        )}

                        {/* Contador de estudiantes */}
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-indigo-200">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                            </svg>
                            <span className="text-white font-bold">{aula.estudiantes?.length || 0}</span>
                            <span className="text-indigo-200 text-sm">estudiantes</span>
                        </div>

                        {/* Botón Chat */}
                        <Link 
                            to={`/dashboard/chat/${aula._id}`}
                            className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-medium backdrop-blur-sm rounded-xl px-5 py-2.5 transition shadow-lg shadow-indigo-500/30"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                            </svg>
                            Abrir Chat
                        </Link>
                    </div>
                </div>
            </div>

            {/* Sección de Estudiantes Inscritos */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-indigo-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                        </svg>
                        Estudiantes Inscritos
                    </h2>
                    <span className="text-sm text-slate-500 font-semibold bg-slate-800 px-3 py-1 rounded-full">
                        {aula.estudiantes?.length || 0} total
                    </span>
                </div>

                {/* Lista de estudiantes */}
                {aula.estudiantes?.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-slate-500 text-sm">
                            Aún no hay estudiantes inscritos en esta aula.
                        </p>
                        {rol === "docente" && (
                            <p className="text-slate-600 text-xs mt-2">
                                Comparte el código <span className="font-mono font-bold text-emerald-400">{aula.codigoAcceso}</span> con tus estudiantes.
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {aula.estudiantes.map((estudiante, index) => (
                            <div 
                                key={estudiante._id} 
                                className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 
                                           hover:bg-slate-800 transition border border-transparent 
                                           hover:border-slate-700"
                            >
                                {/* Número de orden */}
                                <span className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center 
                                                 text-xs font-bold text-slate-300">
                                    {index + 1}
                                </span>

                                {/* Avatar con inicial */}
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 
                                                flex items-center justify-center text-white font-bold text-sm shadow-md">
                                    {estudiante.nombre?.charAt(0)?.toUpperCase()}
                                    {estudiante.apellido?.charAt(0)?.toUpperCase()}
                                </div>

                                {/* Datos del estudiante */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-semibold text-sm truncate">
                                        {estudiante.nombre} {estudiante.apellido}
                                    </p>
                                    <p className="text-slate-400 text-xs truncate">
                                        {estudiante.email}
                                    </p>
                                </div>

                                {/* Badge de estado */}
                                <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                    Activo
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AulaDetalle
