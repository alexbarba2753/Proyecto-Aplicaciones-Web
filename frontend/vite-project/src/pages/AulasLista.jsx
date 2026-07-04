import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import storeAulas from "../context/storeAulas"
import storeAuth from "../context/storeAuth"
import AulaCard from "../components/aulas/AulaCard"
import ModalUnirse from "../components/aulas/ModalUnirse"

const AulasLista = () => {
    const { aulas, cargando, fetchAulas, archivarAula } = storeAulas()
    const { rol } = storeAuth()
    const [modalAbierto, setModalAbierto] = useState(false)

    // Cargar las aulas al montar el componente
    useEffect(() => {
        fetchAulas()
    }, [])

    return (
        <div>
            {/* Header de la sección */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        {rol === "docente" ? "Mis Aulas Virtuales" : "Mis Aulas Inscritas"}
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        {rol === "docente" 
                            ? "Gestiona y supervisa las aulas de prácticas preprofesionales" 
                            : "Accede a las aulas donde estás inscrito"
                        }
                    </p>
                </div>

                {/* Botones de acción según el rol */}
                <div className="flex items-center gap-3">
                    {rol === "estudiante" && (
                        <button
                            onClick={() => setModalAbierto(true)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold 
                                       bg-gradient-to-r from-indigo-600 to-violet-600 
                                       hover:from-indigo-500 hover:to-violet-500 
                                       transition text-sm shadow-lg shadow-indigo-900/30"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                            </svg>
                            Unirse con Código
                        </button>
                    )}

                    {rol === "docente" && (
                        <Link
                            to="/dashboard/aulas/crear"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold 
                                       bg-gradient-to-r from-emerald-600 to-teal-600 
                                       hover:from-emerald-500 hover:to-teal-500 
                                       transition text-sm shadow-lg shadow-emerald-900/30"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Crear Aula
                        </Link>
                    )}
                </div>
            </div>

            {/* Estado de carga */}
            {cargando && (
                <div className="flex items-center justify-center py-20">
                    <div className="flex items-center gap-3 text-slate-400">
                        <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        <span className="font-medium">Cargando aulas...</span>
                    </div>
                </div>
            )}

            {/* Estado vacío */}
            {!cargando && aulas.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-slate-800 flex items-center justify-center mb-5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-slate-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">
                        {rol === "docente" ? "Aún no has creado ningún aula" : "No estás inscrito en ningún aula"}
                    </h3>
                    <p className="text-sm text-slate-500 max-w-sm">
                        {rol === "docente" 
                            ? "Crea tu primera aula virtual para que tus estudiantes puedan unirse." 
                            : "Solicita el código de acceso a tu docente para unirte a un aula."
                        }
                    </p>
                </div>
            )}

            {/* Grid de tarjetas tipo Classroom */}
            {!cargando && aulas.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {aulas.map((aula, index) => (
                        <AulaCard
                            key={aula._id}
                            aula={aula}
                            index={index}
                            rolUsuario={rol}
                            onArchivar={rol === "docente" ? archivarAula : null}
                        />
                    ))}
                </div>
            )}

            {/* Modal para unirse con código */}
            <ModalUnirse 
                isOpen={modalAbierto} 
                onClose={() => setModalAbierto(false)} 
            />
        </div>
    )
}

export default AulasLista
