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

const storeAulas = create((set, get) => ({
    // Estado global para almacenar la lista de aulas y el aula seleccionada
    aulas: [],
    aulaSeleccionada: null,
    cargando: false,

    // ═══════════════════════════════════════════════════════════
    // LISTAR AULAS del usuario autenticado
    // ═══════════════════════════════════════════════════════════
    fetchAulas: async () => {
        try {
            set({ cargando: true })
            const url = `${import.meta.env.VITE_BACKEND_URL}/aulas`
            const respuesta = await axios.get(url, getAuthHeaders())
            set({ aulas: respuesta.data, cargando: false })
        } catch (error) {
            console.error("Error al obtener las aulas:", error)
            set({ cargando: false })
            toast.error(error.response?.data?.msg || "Error al cargar las aulas")
        }
    },

    // ═══════════════════════════════════════════════════════════
    // OBTENER DETALLE de un aula por ID
    // ═══════════════════════════════════════════════════════════
    fetchAulaDetalle: async (id) => {
        try {
            set({ cargando: true })
            const url = `${import.meta.env.VITE_BACKEND_URL}/aulas/${id}`
            const respuesta = await axios.get(url, getAuthHeaders())
            set({ aulaSeleccionada: respuesta.data, cargando: false })
        } catch (error) {
            console.error("Error al obtener el detalle del aula:", error)
            set({ cargando: false })
            toast.error(error.response?.data?.msg || "Error al cargar el aula")
        }
    },

    // ═══════════════════════════════════════════════════════════
    // CREAR nueva aula (Solo Docente)
    // ═══════════════════════════════════════════════════════════
    crearAula: async (data) => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/aulas`
            const respuesta = await axios.post(url, data, getAuthHeaders())
            
            // Agregamos la nueva aula al inicio del arreglo existente
            set((state) => ({
                aulas: [respuesta.data.aula, ...state.aulas]
            }))
            
            toast.success("Aula creada exitosamente")
            return respuesta.data
        } catch (error) {
            console.error("Error al crear el aula:", error)
            toast.error(error.response?.data?.msg || "Error al crear el aula")
            return null
        }
    },

    // ═══════════════════════════════════════════════════════════
    // ACTUALIZAR datos del aula (Solo Docente propietario)
    // ═══════════════════════════════════════════════════════════
    actualizarAula: async (id, data) => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/aulas/${id}`
            const respuesta = await axios.put(url, data, getAuthHeaders())
            
            // Actualizamos la aula en la lista local
            set((state) => ({
                aulas: state.aulas.map(aula =>
                    aula._id === id ? respuesta.data.aula : aula
                ),
                aulaSeleccionada: respuesta.data.aula
            }))
            
            toast.success("Aula actualizada correctamente")
            return respuesta.data
        } catch (error) {
            console.error("Error al actualizar el aula:", error)
            toast.error(error.response?.data?.msg || "Error al actualizar el aula")
            return null
        }
    },

    // ═══════════════════════════════════════════════════════════
    // ARCHIVAR aula / soft delete (Solo Docente propietario)
    // ═══════════════════════════════════════════════════════════
    archivarAula: async (id) => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/aulas/${id}`
            await axios.delete(url, getAuthHeaders())
            
            // Removemos el aula de la lista local
            set((state) => ({
                aulas: state.aulas.filter(aula => aula._id !== id)
            }))
            
            toast.success("Aula archivada correctamente")
            return true
        } catch (error) {
            console.error("Error al archivar el aula:", error)
            toast.error(error.response?.data?.msg || "Error al archivar el aula")
            return false
        }
    },

    // ═══════════════════════════════════════════════════════════
    // UNIRSE a un aula con código de acceso (Solo Estudiante)
    // ═══════════════════════════════════════════════════════════
    unirseAula: async (codigoAcceso) => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/aulas/unirse`
            const respuesta = await axios.post(url, { codigoAcceso }, getAuthHeaders())
            
            toast.success(respuesta.data.msg)
            
            // Refrescamos la lista de aulas para que aparezca la nueva
            await get().fetchAulas()
            
            return true
        } catch (error) {
            console.error("Error al unirse al aula:", error)
            toast.error(error.response?.data?.msg || "Error al unirse al aula")
            return false
        }
    },

    // Limpiar el aula seleccionada al salir del detalle
    limpiarAulaSeleccionada: () => set({ aulaSeleccionada: null })
}))

export default storeAulas
