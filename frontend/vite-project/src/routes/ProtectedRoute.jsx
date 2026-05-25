import { Navigate } from "react-router-dom" // Estandarizado a react-router-dom
import storeAuth from "../context/storeAuth" // Importación por defecto limpia (sin llaves)

const ProtectedRoute = ({ children }) => {
    const token = storeAuth(state => state.token)
    
    // Si hay token, lo deja pasar; si no, lo bota al login
    return token ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute