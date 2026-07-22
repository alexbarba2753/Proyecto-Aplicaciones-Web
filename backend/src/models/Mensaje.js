import { Schema, model } from 'mongoose'

/**
 * MODELO: Mensaje del Chat en Tiempo Real
 * 
 * Almacena los mensajes enviados dentro de las aulas virtuales.
 * Cada mensaje está vinculado a un remitente (Usuario) y un aula (Aula).
 * Los mensajes se persisten en MongoDB para mantener el historial completo.
 */
const mensajeSchema = new Schema({
    
    // El usuario que envió el mensaje
    remitente: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El remitente es obligatorio']
    },

    // El aula virtual donde se envió el mensaje (define la "sala" del chat)
    aula: {
        type: Schema.Types.ObjectId,
        ref: 'Aula',
        required: [true, 'El aula es obligatoria']
    },

    // Contenido textual del mensaje
    contenido: {
        type: String,
        required: [true, 'El contenido del mensaje es obligatorio'],
        trim: true,
        maxlength: [1000, 'El mensaje no puede superar los 1000 caracteres']
    },

    // Fecha y hora exacta del envío
    timestamp: {
        type: Date,
        default: Date.now
    }

}, {
    // Desactivamos timestamps automáticos ya que usamos nuestro propio campo 'timestamp'
    timestamps: false
})

// Índice compuesto para consultas eficientes: mensajes de un aula ordenados por fecha
mensajeSchema.index({ aula: 1, timestamp: -1 })

export default model('Mensaje', mensajeSchema)
