import { useState, useEffect, useRef } from "react"
import { useParams, Link } from "react-router-dom"
import { io } from "socket.io-client"
import storeAuth from "../context/storeAuth"
import storeProfile from "../context/userProfile"
import { useFetch } from "../hooks/useFetch"

const ChatAula = () => {
    const { id: aulaId } = useParams()
    const { token } = storeAuth()
    const { user } = storeProfile()
    const { fetchDataBackend } = useFetch()
    
    const [mensajes, setMensajes] = useState([])
    const [nuevoMensaje, setNuevoMensaje] = useState("")
    const [socket, setSocket] = useState(null)
    const [cargando, setCargando] = useState(true)
    const messagesEndRef = useRef(null)

    // Auto-scroll al último mensaje
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    // 1. Cargar historial de mensajes REST
    useEffect(() => {
        const cargarHistorial = async () => {
            try {
                const url = `${import.meta.env.VITE_BACKEND_URL}/aulas/${aulaId}/mensajes`
                const respuesta = await fetchDataBackend(url, null, "GET", {
                    Authorization: `Bearer ${token}`
                })
                if (respuesta?.mensajes) {
                    // Los mensajes vienen ordenados descendente en el backend para paginación,
                    // por lo que los invertimos para mostrarlos cronológicamente
                    setMensajes(respuesta.mensajes.reverse())
                }
            } catch (error) {
                console.error("Error al cargar historial de chat:", error)
            } finally {
                setCargando(false)
                scrollToBottom()
            }
        }
        cargarHistorial()
    }, [aulaId])

    // 2. Inicializar Socket.io
    useEffect(() => {
        if (!token) return

        // Extraer host base eliminando /api
        const backendURL = import.meta.env.VITE_BACKEND_URL.replace(/\/api$/, '')
        
        const newSocket = io(backendURL, {
            auth: { token }
        })

        newSocket.on("connect", () => {
            console.log("Conectado al chat en tiempo real")
            newSocket.emit("unirse-aula", aulaId)
        })

        newSocket.on("nuevo-mensaje", (mensaje) => {
            setMensajes((prev) => [...prev, mensaje])
        })

        setSocket(newSocket)

        return () => {
            newSocket.disconnect()
        }
    }, [aulaId, token])

    // Auto-scroll cada vez que cambia el array de mensajes
    useEffect(() => {
        scrollToBottom()
    }, [mensajes])

    // 3. Enviar mensaje
    const handleEnviar = (e) => {
        e.preventDefault()
        if (!nuevoMensaje.trim() || !socket) return

        // Emitir al servidor
        socket.emit("enviar-mensaje", {
            aulaId,
            contenido: nuevoMensaje
        })

        // Limpiar el input
        setNuevoMensaje("")
    }

    if (cargando) {
        return <div className="text-white text-center mt-20">Cargando chat...</div>
    }

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] max-h-screen bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            {/* Header del Chat */}
            <div className="bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between">
                <div>
                    <h2 className="text-white font-bold text-lg flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-indigo-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                        </svg>
                        Chat del Aula
                    </h2>
                    <p className="text-slate-400 text-xs">Comunicación en tiempo real</p>
                </div>
                <Link to={`/dashboard/aulas/${aulaId}`} className="text-sm bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg transition">
                    Volver al Aula
                </Link>
            </div>

            {/* Área de Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
                {mensajes.length === 0 ? (
                    <div className="text-center text-slate-500 mt-10">No hay mensajes. ¡Sé el primero en saludar!</div>
                ) : (
                    mensajes.map((msg, index) => {
                        const remitenteValido = msg.remitente || { _id: 'deleted', nombre: 'Usuario', apellido: 'Eliminado', perfil: null }
                        const esMio = remitenteValido._id === user._id
                        return (
                            <div key={msg._id || index} className={`flex gap-3 ${esMio ? 'flex-row-reverse' : 'flex-row'}`}>
                                {/* Avatar */}
                                <img 
                                    src={remitenteValido.perfil || "https://cdn-icons-png.flaticon.com/512/4715/4715329.png"} 
                                    alt="Avatar" 
                                    className="w-8 h-8 rounded-full border border-slate-700 object-cover"
                                />
                                {/* Burbuja */}
                                <div className={`max-w-[70%] ${esMio ? 'items-end' : 'items-start'} flex flex-col`}>
                                    <span className="text-xs text-slate-400 mb-1 mx-1">
                                        {esMio ? 'Tú' : `${remitenteValido.nombre} ${remitenteValido.apellido}`}
                                    </span>
                                    <div className={`px-4 py-2 rounded-2xl ${esMio ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-slate-800 text-slate-200 rounded-tl-sm'}`}>
                                        {msg.contenido}
                                    </div>
                                    <span className="text-[10px] text-slate-500 mt-1 mx-1">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        )
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input de Nuevo Mensaje */}
            <form onSubmit={handleEnviar} className="p-4 bg-slate-800 border-t border-slate-700 flex gap-2">
                <input 
                    type="text" 
                    value={nuevoMensaje}
                    onChange={(e) => setNuevoMensaje(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500"
                />
                <button 
                    type="submit" 
                    disabled={!nuevoMensaje.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl font-medium transition disabled:opacity-50"
                >
                    Enviar
                </button>
            </form>
        </div>
    )
}

export default ChatAula
