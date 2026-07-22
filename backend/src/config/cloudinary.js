import { v2 as cloudinary } from 'cloudinary'
import streamifier from 'streamifier'
import dotenv from 'dotenv'
dotenv.config()

// ═══════════════════════════════════════════════════════
// CONFIGURACIÓN DEL SDK DE CLOUDINARY
// Inicializa la conexión con las credenciales del .env
// ═══════════════════════════════════════════════════════
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


/**
 * Sube un buffer de imagen directamente a Cloudinary sin guardarlo en disco.
 * Usa streamifier para convertir el Buffer a un ReadableStream compatible
 * con cloudinary.uploader.upload_stream().
 * 
 * @param {Buffer} buffer - El buffer binario de la imagen (ej: desde Hugging Face API)
 * @param {string} publicId - ID público único para la imagen en Cloudinary (ej: "avatar_userId")
 * @returns {Promise<string>} - La URL segura (HTTPS) de la imagen subida
 * @throws {Error} - Si la subida a Cloudinary falla
 */
const subirBufferACloudinary = (buffer, publicId) => {
    return new Promise((resolve, reject) => {
        // Configuramos las opciones de subida a Cloudinary
        const opciones = {
            folder: 'avatares_esfot',           // Carpeta dedicada en Cloudinary
            public_id: publicId,                 // ID único para evitar colisiones
            resource_type: 'image',              // Tipo de recurso: imagen
            overwrite: true,                     // Sobreescribir si ya existe (actualización de avatar)
            transformation: [
                { width: 256, height: 256, crop: 'fill', gravity: 'face' }  // Normaliza a 256x256 con detección de rostro
            ]
        }

        // Creamos el stream de subida con el callback de resultado
        const uploadStream = cloudinary.uploader.upload_stream(
            opciones,
            (error, resultado) => {
                if (error) {
                    console.error('❌ Error subiendo imagen a Cloudinary:', error.message)
                    return reject(error)
                }
                // Retornamos la URL segura (HTTPS) de la imagen alojada en el CDN
                resolve(resultado.secure_url)
            }
        )

        // Convertimos el Buffer a un ReadableStream y lo enviamos al upload stream
        // streamifier evita escribir el archivo en disco (ideal para Render/Railway)
        streamifier.createReadStream(buffer).pipe(uploadStream)
    })
}


/**
 * Elimina una imagen de Cloudinary por su URL o public_id.
 * Útil para limpiar avatares antiguos cuando el usuario actualiza su foto.
 * 
 * @param {string} publicId - El public_id de la imagen en Cloudinary
 * @returns {Promise<object>} - Resultado de la eliminación
 */
const eliminarDeCloudinary = async (publicId) => {
    try {
        const resultado = await cloudinary.uploader.destroy(publicId)
        return resultado
    } catch (error) {
        console.error('❌ Error eliminando imagen de Cloudinary:', error.message)
        throw error
    }
}


export { subirBufferACloudinary, eliminarDeCloudinary }
export default cloudinary
