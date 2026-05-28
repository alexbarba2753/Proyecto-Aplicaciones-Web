import { Link, useNavigate, useLocation, Outlet } from "react-router-dom"
import storeAuth from "../context/storeAuth"

const Dashboard = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const urlActual = location.pathname
    
    const { clearToken } = storeAuth()

    const handleLogout = () => {
        clearToken() // Limpia todo el estado de autenticación de golpe
        navigate('/login')
    }

    return (
        <div className="flex h-screen bg-slate-950 font-sans text-slate-100">
            
            {/* BARRA LATERAL (SIDEBAR) */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-6">
                <div>
                    {/* Título del Sistema */}
                    <div className="mb-10 px-2">
                        <h2 className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
                            PraxisFlow
                        </h2>
                        <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                            Panel de Control
                        </span>
                    </div>

                    {/* Menú de Navegación Institucional */}
                    <nav className="space-y-2">
                        {/* Ejemplo de enlace activo usando la lógica de urlActual del docente */}
                        <Link 
                            to="/dashboard" 
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-semibold text-sm ${
                                urlActual === '/dashboard' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            </svg>
                            Inicio
                        </Link>
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

            {/* ÁREA DE CONTENIDO PRINCIPAL */}
            <main className="flex-1 flex flex-col min-w-0">
                
                {/* BARRA SUPERIOR (HEADER) */}
                <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/50 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <p className="text-sm text-slate-400 font-medium">Sistema Activo ESFOT</p>
                    </div>
                    <div className="text-sm font-semibold text-slate-300">
                        Portal del Estudiante
                    </div>
                </header>

                {/* CONTENIDO DINÁMICO */}
                <div className="flex-1 p-8 overflow-y-auto bg-slate-950">
                    
                    {/* 🎓 RECOMPUESTO: Mantenemos tus cuadros solo cuando estás en la raíz del dashboard */}
                    {urlActual === '/dashboard' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {/* Cuadro Naranja */}
                            <div className="bg-gradient-to-br from-amber-600 to-orange-700 p-6 rounded-2xl shadow-lg border border-orange-500/30 flex flex-col justify-between h-40">
                                <span className="text-xs uppercase font-bold tracking-wider text-orange-100">Horas Registradas</span>
                                <h3 className="text-3xl font-black">0 hrs</h3>
                            </div>

                            {/* Cuadro Negro */}
                            <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 flex flex-col justify-between h-40">
                                <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Bitácoras Pendientes</span>
                                <h3 className="text-3xl font-black text-slate-200">0</h3>
                            </div>

                            {/* Cuadro Verde */}
                            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 rounded-2xl shadow-lg border border-emerald-500/30 flex flex-col justify-between h-40">
                                <span className="text-xs uppercase font-bold tracking-wider text-emerald-100">Estado del Proceso</span>
                                <h3 className="text-3xl font-bold">En Espera</h3>
                            </div>
                        </div>
                    )}

                    {/* 🎓 CRÍTICO: Aquí es donde se inyectarán las subpáginas cuando navegues */}
                    <Outlet />
                    
                </div>
            </main>
        </div>
    )
}

export default Dashboard