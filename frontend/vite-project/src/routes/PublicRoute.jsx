import { Navigate, Outlet } from "react-router-dom"
import storeAuth from "../context/storeAuth"

const PublicRoute = () => {
    const { token } = storeAuth()
    
    // Si ya está logueado, lo manda al dashboard; si no, le deja ver la página pública
    return token ? <Navigate to="/dashboard" /> : <Outlet />
}

export default PublicRoute