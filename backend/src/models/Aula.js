import { Schema, model } from 'mongoose'
import crypto from 'crypto'

const aulaSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
        maxlength: [80, 'El nombre no puede superar los 80 caracteres']
    },
    empresa: {
        type: String,
        required: true,
        trim: true,
        minlength: [2, 'El nombre de la empresa debe tener al menos 2 caracteres'],
        maxlength: [100, 'El nombre de la empresa no puede superar los 100 caracteres']
    },
    descripcion: {
        type: String,
        trim: true,
        maxlength: [200, 'La descripción no puede superar los 200 caracteres'],
        default: null
    },
    codigoAcceso: {
        type: String,
        unique: true,
        uppercase: true
    },
    docente: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    estudiantes: [{
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }],
    estado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

/**
 * Genera un código de acceso único de 6 caracteres alfanuméricos en mayúsculas.
 * Usa crypto.randomBytes para máxima seguridad y verifica unicidad en la BDD.
 */
aulaSchema.statics.generarCodigoUnico = async function () {
    let codigoGenerado
    let existeEnBDD = true

    // Bucle hasta encontrar un código que no esté en uso
    while (existeEnBDD) {
        // Genera 4 bytes aleatorios → los convierte a base36 → toma 6 caracteres → mayúsculas
        codigoGenerado = crypto.randomBytes(4)
            .toString('hex')
            .slice(0, 6)
            .toUpperCase()

        // Consulta si ya existe algún aula con ese mismo código
        existeEnBDD = await this.findOne({ codigoAcceso: codigoGenerado })
    }

    return codigoGenerado
}

export default model('Aula', aulaSchema)
