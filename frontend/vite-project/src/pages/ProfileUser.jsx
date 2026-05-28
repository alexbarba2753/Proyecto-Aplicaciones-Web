// 🎓 CORREGIDO: Apuntando a la subcarpeta /profile/ como lo tiene el docente
import userCardProfile from "../components/profile/userCardProfile.jsx"
import userFormularioPerfil from "../components/profile/userFormProfile.jsx"
import userCardPassword from "../components/profile/userCardPassword.jsx"

const ProfileUser = () => {
    return (
        <>       
            {/* Cabecera del Módulo */}
            <div>
                <h1 className='font-black text-4xl text-slate-200'>Perfil</h1>
                <hr className='my-4 border-t border-slate-800'/>
                <p className='mb-8 text-slate-400'>Este módulo te permite gestionar el perfil del usuario</p>
            </div>

            {/* Distribución idéntica a la del docente (Flexibilidad para dos mitades) */}
            <div className='flex justify-around gap-x-8 flex-wrap gap-y-8 md:flex-nowrap'>

                {/* Columna 1: Formulario de actualización de datos personales (Mitad izquierda) */}
                <div className='w-full md:w-1/2'>
                    <userFormularioPerfil />
                </div>

                {/* Columna 2: Tarjeta visual y Formulario para cambiar la contraseña (Mitad derecha) */}
                <div className='w-full md:w-1/2 space-y-6'>
                    <userCardProfile />
                    <userCardPassword />
                </div>

            </div>
        </>
    )
}

export default ProfileUser