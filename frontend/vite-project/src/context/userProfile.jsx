import { create } from "zustand"
import axios from "axios"

// Función auxiliar para obtener las cabeceras de autenticación seguras
const getAuthHeaders = () => {
    // Buscamos el token en el localStorage con la clave exacta que maneja Zustand
    const storedUser = JSON.parse(localStorage.getItem("auth-token"))
    return {
        headers: {
            "Content-Type": "application/json",
            // Apunta al token guardado dentro del estado global
            Authorization: `Bearer ${storedUser?.state?.token}`,
        },
    }
}

const storeProfile = create((set) => ({
    // Estado global para almacenar los datos del usuario logueado
    user: null,
    
    // Función para limpiar el perfil al cerrar sesión
    clearUser: () => set({ user: null }),
    
    // Función asíncrona para traer los datos desde el backend institucional
    profile: async () => {
        try {
            // 🎓 ADAPTADO: Apunta a la ruta real usando la base de tu .env
            const url = `${import.meta.env.VITE_BACKEND_URL}/usuario/perfil`
            
            const respuesta = await axios.get(url, getAuthHeaders())
            
            // Guardamos la información del estudiante/usuario en el estado global
            set({ user: respuesta.data })
        } catch (error) {
            console.error("Error al obtener el perfil del usuario:", error)
        }
    }
}))

export default storeProfile