import { Navigate, Outlet } from "react-router-dom" // Estandarizado a react-router-dom
import storeAuth from "../context/storeAuth" // Importación por defecto limpia (sin llaves)

const PublicRoute = () => {
    const token = storeAuth((state) => state.token)
    
    // Si ya está logueado, lo manda al dashboard; si no, le deja ver la página pública
    return token ? <Navigate to="/dashboard" /> : <Outlet />
}

export default PublicRoute