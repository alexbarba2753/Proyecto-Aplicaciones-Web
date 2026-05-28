import UserCardProfile from "../components/profile/UserCardProfile"
import UserFormularioPerfil from "../components/profile/UserFormProfile"
import UserCardPassword from "../components/profile/UserCardPassword"

const ProfileUser = () => {
    return (
        <div className="space-y-8">
            <UserCardProfile />       
            <UserFormularioPerfil />
            <UserCardPassword />
        </div>
    )
}
export default ProfileUser