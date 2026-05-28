import { Navigate } from "react-router-dom"
import storeAuth from "../context/storeAuth"

const ProtectedRoute = ({ children }) => {
    // 🛠️ CORREGIDO: Desestructuración directa para evitar fallos de lectura reactiva
    const { token } = storeAuth()
    
    // Si hay token, lo deja pasar; si no, lo bota de golpe al login
    return token ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute