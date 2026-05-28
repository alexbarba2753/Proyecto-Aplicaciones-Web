import { create } from "zustand"
import axios from "axios"
import { toast } from "react-toastify"

// Función auxiliar para obtener las cabeceras de autenticación seguras
const getAuthHeaders = () => {
    const storedUser = JSON.parse(localStorage.getItem("auth-token"))
    return {
        headers: {
            "Content-Type": "application/json",
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
            const url = `${import.meta.env.VITE_BACKEND_URL}/usuario/perfil`
            const respuesta = await axios.get(url, getAuthHeaders())
            set({ user: respuesta.data })
        } catch (error) {
            console.error("Error al obtener el perfil del usuario:", error)
        }
    },

    // Función para actualizar los datos desde los formularios
    updateProfile: async (url, data) => {
        try {
            const respuesta = await axios.put(url, data, getAuthHeaders())
            set({ user: respuesta.data })
            toast.success("Perfil actualizado correctamente")
        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.msg)
        }
    },

    // 🎓 AÑADIDO: Función para cambiar la contraseña de forma segura
    updatePasswordProfile: async (url, data) => {
        try {
            const respuesta = await axios.put(url, data, getAuthHeaders())
            // Retorna la respuesta completa para que el formulario la maneje (por ejemplo, para hacer un reset de los inputs)
            return respuesta
        } catch (error) {
            console.error(error)
            // Lanza la alerta de error con el mensaje de tu backend si algo falla (ej: "Password actual incorrecto")
            toast.error(error.response?.data?.msg)
        }
    }
}))

export default storeProfile