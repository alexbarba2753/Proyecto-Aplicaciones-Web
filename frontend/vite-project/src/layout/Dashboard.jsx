import { Link, useNavigate, useLocation, Outlet } from "react-router-dom"
import storeAuth from "../context/storeAuth"
import storeProfile from "../context/userProfile"
import { useState } from "react"
import ModalUnirse from "../components/aulas/ModalUnirse" 

const Dashboard = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const urlActual = location.pathname
    
    const { clearToken, rol } = storeAuth()
    const { user } = storeProfile()
    const [modalUnirse, setModalUnirse] = useState(false) 

    const handleLogout = () => {
        clearToken() 
        navigate('/login')
    }

    return (
        <div className="flex h-screen bg-slate-950 font-sans text-slate-100">
            

            <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-6">
                <div>
                    {/* Título del Sistema */}
                    <div className="mb-6 px-2">
                        <h2 className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
                            PraxisFlow
                        </h2>
                        <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                            Panel de Control
                        </span>
                    </div>


                    <div className="px-2 mb-6 border-b border-slate-800/60 pb-5 text-sm space-y-2">
                        <p className="text-slate-400 flex items-center gap-2 font-medium"> 
                            <span className="bg-emerald-500 w-2.5 h-2.5 inline-block rounded-full animate-pulse"></span> 
                            Bienvenido - <span className="text-slate-200 font-semibold">{user?.nombre || "Cargando..."}</span>
                        </p>
                        {/* Se eliminó el "pl-41" dañino para una alineación limpia */}
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider pl-4"> 
                            Rol: <span className="text-slate-400 font-medium normal-case">{user?.rol || "—"}</span>
                        </p>
                    </div>


                    <nav className="space-y-1.5">
                        {/* Enlace Inicio */}
                        <Link 
                            to="/dashboard" 
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition font-semibold text-sm ${
                                urlActual === '/dashboard' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            </svg>
                            Inicio
                        </Link>

                        {/* Enlace Perfil */}
                        <Link 
                            to="/dashboard/profile" 
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition font-semibold text-sm ${
                                urlActual === '/dashboard/profile' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7 0 3.75 3.75 0 0 1 7 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                            Perfil
                        </Link>

                        {/* Enlace Mis Aulas */}
                        <Link 
                            to="/dashboard/aulas" 
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition font-semibold text-sm ${
                                urlActual.startsWith('/dashboard/aulas') ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                            </svg>
                            Mis Aulas
                        </Link>

                        {/* Enlace Crear Aula (Solo Docente) */}
                        {rol === 'docente' && (
                            <Link 
                                to="/dashboard/aulas/crear" 
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition font-semibold text-sm ${
                                    urlActual === '/dashboard/aulas/crear' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                Crear Aula
                            </Link>
                        )}

                        {/* Enlace Unirse a Aula (Solo Estudiante) */}
                        {rol === 'estudiante' && (
                            <button
                                onClick={() => setModalUnirse(true)}
                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition font-semibold text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 w-full"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                                </svg>
                                Unirse con Código
                            </button>
                        )}
                    </nav>
                </div>

                {/* Botón de Salida */}
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-red-950/30 hover:border hover:border-red-900/50 transition duration-200 font-medium text-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                    </svg>
                    Cerrar Sesión
                </button>
            </aside>

            <main className="flex-1 flex flex-col min-w-0">
                
                {/* BARRA SUPERIOR (HEADER) */}
                <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/50 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <p className="text-sm text-slate-400 font-medium">Sistema Activo ESFOT</p>
                    </div>
                    
                    <div className="text-sm font-semibold text-slate-300 bg-slate-800/40 px-4 py-1.5 rounded-xl border border-slate-800">
                        Usuario: <span className="text-slate-100 font-bold ml-1">{user?.nombre || "Cargando..."}</span>
                    </div>
                </header>

                {/* CONTENIDO DINÁMICO */}
                <div className="flex-1 p-8 overflow-y-auto bg-slate-950">
                    
                    {/* Condicional para los tres cuadros iniciales */}
                    {urlActual === '/dashboard' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-gradient-to-br from-amber-600 to-orange-700 p-6 rounded-2xl shadow-lg border border-orange-500/30 flex flex-col justify-between h-40">
                                <span className="text-xs uppercase font-bold tracking-wider text-orange-100">Horas Registradas</span>
                                <h3 className="text-3xl font-black">0 hrs</h3>
                            </div>

                            <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 flex flex-col justify-between h-40">
                                <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Bitácoras Pendientes</span>
                                <h3 className="text-3xl font-black text-slate-200">0</h3>
                            </div>

                            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 rounded-2xl shadow-lg border border-emerald-500/30 flex flex-col justify-between h-40">
                                <span className="text-xs uppercase font-bold tracking-wider text-emerald-100">Estado del Proceso</span>
                                <h3 className="text-3xl font-bold">En Espera</h3>
                            </div>
                        </div>
                    )}

                    {/* Espacio dinámico para subpáginas */}
                    <Outlet />

                    {/* Modal para unirse a un aula (Estudiante) */}
                    <ModalUnirse isOpen={modalUnirse} onClose={() => setModalUnirse(false)} />
                    
                </div>
            </main>
        </div>
    )
}

export default Dashboard