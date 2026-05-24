import { Link } from 'react-router-dom'

export const Home = () => {
    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            {/* Encabezado / Navbar */}
            <header className="container mx-auto py-4 px-6 flex justify-between items-center bg-white shadow-sm">
                <h1 className='font-bold text-2xl text-gray-800 tracking-wide'>
                    Practicas<span className='text-gray-500'>PPoli</span>
                </h1>
                <nav>
                    <ul className='flex gap-6 justify-center text-sm font-semibold text-gray-600'>
                        <li><a href="#" className='hover:text-gray-900 transition'>Inicio</a></li>
                        <li><a href="#" className='hover:text-gray-900 transition'>ESFOT</a></li>
                        <li><a href="#" className='hover:text-gray-900 transition'>Ayuda</a></li>
                    </ul>
                </nav>
            </header>

            {/* Sección Principal (Hero) */}
            <main className='container mx-auto max-w-5xl text-center py-20 px-6 flex flex-col items-center justify-center gap-6'>
                <div className='max-w-2xl'>
                    <span className="text-xs font-bold uppercase tracking-widest bg-gray-200 text-gray-700 px-3 py-1 rounded-full">
                        ESFOT - EPN
                    </span>
                    <h1 className='font-extrabold text-gray-800 uppercase text-4xl sm:text-5xl my-4 leading-tight'>
                        Gestión y Control de Prácticas Preprofesionales
                    </h1>
                    <p className='text-gray-600 text-lg sm:text-xl font-normal my-4 max-w-xl mx-auto'>
                        Optimiza el registro de tus actividades diarias, la validación de horas acumuladas y la generación automatizada de tus bitácoras institucionales.
                    </p>
                    <div className="mt-8">
                        <Link 
                            to="/login" 
                            className='inline-block bg-gray-800 text-white font-semibold text-base px-8 py-3 rounded-md shadow-md hover:bg-gray-700 transition duration-300'
                        >
                            Ingresar al Sistema
                        </Link>
                    </div>
                </div>
            </main>

            {/* Sección Breve de Módulos */}
            <section className='container mx-auto max-w-5xl px-6 py-10 border-t border-gray-200'>
                <h2 className='font-bold text-xl text-center text-gray-500 uppercase tracking-wider mb-10'>
                    Módulos del Sistema
                </h2>

                <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
                    {/* Tarjeta Estudiantes */}
                    <div className="text-center p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="text-2xl mb-2">👨‍🎓</div>
                        <h4 className="text-lg font-bold text-gray-800 mb-2">Estudiantes</h4>
                        <p className="text-sm text-gray-500">
                            Registro de actividades diarias en bitácoras digitales y visualización de horas aprobadas.
                        </p>
                    </div>

                    {/* Tarjeta Tutores */}
                    <div className="text-center p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="text-2xl mb-2">👨‍🏫</div>
                        <h4 className="text-lg font-bold text-gray-800 mb-2">Tutores y Supervisores</h4>
                        <p className="text-sm text-gray-500">
                            Seguimiento y validación en tiempo real de los reportes enviados por los pasantes.
                        </p>
                    </div>

                    {/* Tarjeta Bitácoras */}
                    <div className="text-center p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="text-2xl mb-2">📄</div>
                        <h4 className="text-lg font-bold text-gray-800 mb-2">Documentación</h4>
                        <p className="text-sm text-gray-500">
                            Generación y exportación automatizada de bitácoras oficiales en formato PDF.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer Súper Simplificado */}
            <footer className='text-center bg-white border-t border-gray-200 py-6 mt-20 text-xs text-gray-400 font-medium tracking-wide'>
                <p>© {new Date().getFullYear()} - Escuela Politécnica Nacional - ESFOT. Todos los derechos reservados.</p>
            </footer>
        </div>
    )
}