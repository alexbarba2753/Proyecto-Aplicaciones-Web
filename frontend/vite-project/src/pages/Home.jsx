import { Link } from 'react-router-dom'

export const Home = () => {
    return (

        <div className="bg-slate-50 min-h-screen font-sans bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
            
            {/* 🌐 ENCABEZADO / NAVBAR */}
            <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200/80 px-6 py-4 transition duration-300">
                <div className="container mx-auto flex justify-between items-center max-w-6xl">
                    <h1 className='font-black text-2xl text-slate-900 tracking-tight'>
                        Practicas<span className='bg-gradient-to-r from-slate-500 to-slate-800 bg-clip-text text-transparent font-extrabold'>PPoli</span>
                    </h1>
                    <nav>
                        <ul className='flex gap-8 justify-center text-sm font-semibold text-slate-600'>
                            <li><a href="#" className='hover:text-slate-900 transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-slate-800 hover:after:w-full after:transition-all'>Inicio</a></li>
                            <li><a href="https://esfot.epn.edu.ec/" target="_blank" rel="noreferrer" className='hover:text-slate-900 transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-slate-800 hover:after:w-full after:transition-all'>ESFOT</a></li>
                            <li><a href="https://byronloarte.notion.site/S-labo-a25f2d27931e4eee8ade496643fc20cf" target="_blank" rel="noreferrer" className='hover:text-slate-900 transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-slate-800 hover:after:w-full after:transition-all'>Ayuda</a></li>
                        </ul>
                    </nav>
                </div>
            </header>


            <main className='container mx-auto max-w-6xl py-16 lg:py-24 px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
                
                {/* Columna Izquierda: Mensajes y Textos */}
                <div className='text-left flex flex-col items-start gap-5 max-w-xl mx-auto lg:mx-0'>
                    <span className="text-xs font-bold uppercase tracking-widest bg-slate-200/80 text-slate-800 px-3 py-1.5 rounded-full border border-slate-300/50">
                        ESFOT - Escuela Politécnica Nacional
                    </span>
                    <h1 className='font-black text-slate-900 text-4xl sm:text-5xl leading-[1.15] tracking-tight'>
                        Gestión y Control de Prácticas <span className="bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">Preprofesionales</span>
                    </h1>
                    <p className='text-slate-600 text-base sm:text-lg font-normal leading-relaxed'>
                        Optimiza el registro de tus actividades diarias, la validación de horas acumuladas y la generación automatizada de tus bitácoras institucionales en una plataforma centralizada.
                    </p>
                    <div className="mt-4 w-full sm:w-auto">
                        <Link 
                            to="/login" 
                            className='inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-slate-900 text-white font-bold text-base px-8 py-3.5 rounded-xl shadow-lg shadow-slate-950/20 hover:bg-slate-800 hover:-translate-y-0.5 transition duration-300'
                        >
                            Ingresar al Sistema
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </Link>
                    </div>
                </div>

                {/* 🖼️ ESPACIO PARA IMAGEN 1: ILUSTRACIÓN PRINCIPAL HERO */}
                <div className='w-full flex justify-center items-center lg:justify-end'>
                    <div className="relative w-full max-w-md lg:max-w-full aspect-video lg:aspect-square bg-gradient-to-tr from-slate-200 to-slate-100 rounded-2xl border border-slate-300/60 p-2 shadow-xl shadow-slate-200/50 overflow-hidden group">
                        {/* Reemplaza la URL del src por tu asset final, ej: /img/hero-vector.png */}
                        <img 
                            src="/images/esfot_2.jpg" 
                            alt="Ilustración de PracticasPPoli Dashboard" 
                            className="w-full h-full object-cover rounded-xl grayscale-[20%] group-hover:grayscale-0 transition duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent pointer-events-none"></div>
                    </div>
                </div>
            </main>

            {/* 🛠️ SECCIÓN DE MÓDULOS DEL SISTEMA */}
            <section className='container mx-auto max-w-6xl px-6 py-16 border-t border-slate-200/70'>
                <h2 className='font-extrabold text-xs text-center text-slate-400 uppercase tracking-widest mb-12'>
                    Módulos e Integración del Sistema
                </h2>

                <div className='grid grid-cols-1 sm:grid-cols-3 gap-8'>
                    
                    {/* Tarjeta Estudiantes */}
                    <div className="group text-left p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl hover:border-slate-300/80 hover:-translate-y-1 transition duration-300 flex flex-col justify-between">
                        <div>
                            {/* 🖼️ ESPACIO PARA IMAGEN 2: ICONO DE ESTUDIANTES */}
                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-5 group-hover:bg-slate-900 transition duration-300">
                                <img 
                                    src="https://cdn-icons-png.flaticon.com/512/3135/3135810.png" 
                                    alt="Icono Estudiantes" 
                                    className="w-6 h-6 object-contain group-hover:invert transition duration-300"
                                />
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 mb-2">Estudiantes</h4>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Registro de actividades diarias en bitácoras digitales adaptadas y visualización en tiempo real del progreso de tus horas acumuladas.
                            </p>
                        </div>
                    </div>

                    {/* Tarjeta Tutores */}
                    <div className="group text-left p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl hover:border-slate-300/80 hover:-translate-y-1 transition duration-300 flex flex-col justify-between">
                        <div>
                            {/* 🖼️ ESPACIO PARA IMAGEN 3: ICONO DE TUTORES */}
                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-5 group-hover:bg-slate-900 transition duration-300">
                                <img 
                                    src="https://cdn-icons-png.flaticon.com/512/1995/1995539.png" 
                                    alt="Icono Tutores" 
                                    className="w-6 h-6 object-contain group-hover:invert transition duration-300"
                                />
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 mb-2">Tutores y Supervisores</h4>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Panel de revisión completo para el seguimiento y validación oportuna de los reportes cargados por los estudiantes asignados.
                            </p>
                        </div>
                    </div>

                    {/* Tarjeta Documentación */}
                    <div className="group text-left p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl hover:border-slate-300/80 hover:-translate-y-1 transition duration-300 flex flex-col justify-between">
                        <div>
                            {/* 🖼️ ESPACIO PARA IMAGEN 4: ICONO DE DOCUMENTACIÓN */}
                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-5 group-hover:bg-slate-900 transition duration-300">
                                <img 
                                    src="https://cdn-icons-png.flaticon.com/512/2991/2991106.png" 
                                    alt="Icono Documentos" 
                                    className="w-6 h-6 object-contain group-hover:invert transition duration-300"
                                />
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 mb-2">Documentación</h4>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Generación automática y exportación limpia de las bitácoras e informes institucionales oficiales en formato PDF listos para firmar.
                            </p>
                        </div>
                    </div>

                </div>
            </section>


            <footer className='bg-white border-t border-slate-200/80 py-8 text-center text-xs text-slate-400 font-semibold tracking-wider'>
                <div className="container mx-auto px-6 max-w-6xl flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p>© {new Date().getFullYear()} - Escuela Politécnica Nacional. Todos los derechos reservados.</p>
                    <span className="text-[10px] bg-slate-100 px-2.5 py-1 rounded-md text-slate-500 border border-slate-200/60 uppercase">ESFOT - Practicas PPoli</span>
                </div>
            </footer>
        </div>
    )
}