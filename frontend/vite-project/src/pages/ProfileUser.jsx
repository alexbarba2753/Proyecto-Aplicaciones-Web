import UserCardProfile from "../components/profile/UserCardProfile"
import UserFormularioPerfil from "../components/profile/UserFormProfile"
import UserCardPassword from "../components/profile/UserCardPassword"

const ProfileUser = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Columna Izquierda: Tarjeta de Perfil */}
            <div className="lg:col-span-1">
                <UserCardProfile />       
            </div>
            
            {/* Columna Derecha: Formularios de Actualización */}
            <div className="lg:col-span-2 space-y-8">
                <UserFormularioPerfil />
                <UserCardPassword />
            </div>
        </div>
    )
}
export default ProfileUser