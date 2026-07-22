import axios from 'axios'
import { subirBufferACloudinary } from '../config/cloudinary.js'

/**
 * Genera un avatar único usando IA (Hugging Face - Stable Diffusion) y lo sube a Cloudinary.
 * 
 * Pipeline completo:
 * 1. Genera un prompt aleatorio para crear variedad en los avatares
 * 2. Llama a la API de Hugging Face Inference (Stable Diffusion XL)
 * 3. Recibe el buffer binario de la imagen PNG generada
 * 4. Sube el buffer a Cloudinary usando streamifier (sin escribir en disco)
 * 5. Retorna la URL segura (HTTPS) de la imagen en el CDN de Cloudinary
 * 
 * IMPORTANTE: Si cualquier paso falla, retorna null en lugar de lanzar un error.
 * Esto garantiza que el registro del usuario NO se bloquee por un fallo en la IA o en Cloudinary.
 * El usuario simplemente quedará sin foto y podrá subirla después.
 * 
 * @param {string} userId - ID del usuario (se usa como public_id en Cloudinary para evitar colisiones)
 * @returns {Promise<string|null>} - URL de Cloudinary o null si falla
 */
const generarAvatarIA = async (userId) => {

    try {
        // ═══════════════════════════════════════════════════════
        // PASO 1: GENERAR PROMPT ALEATORIO
        // Usamos variaciones para que cada avatar sea único y visualmente atractivo
        // ═══════════════════════════════════════════════════════

        const estilos = [
            'pixel art style',
            'watercolor painting style',
            'geometric abstract style',
            'minimalist flat design',
            'cyberpunk neon style',
            'soft pastel illustration',
            'low poly 3D render',
            'comic book art style'
        ]

        const colores = [
            'blue and purple colors',
            'warm orange and red tones',
            'cool green and teal palette',
            'vibrant rainbow gradient',
            'monochrome grayscale',
            'sunset gold and pink',
            'ocean blue and coral',
            'forest green and amber'
        ]

        const sujetos = [
            'friendly robot avatar',
            'abstract geometric face',
            'cute animal character portrait',
            'futuristic astronaut helmet',
            'magical crystal orb',
            'digital nature landscape circle',
            'abstract DNA helix art',
            'stylized mountain silhouette'
        ]

        // Seleccionamos aleatoriamente un elemento de cada arreglo
        const estilo = estilos[Math.floor(Math.random() * estilos.length)]
        const color = colores[Math.floor(Math.random() * colores.length)]
        const sujeto = sujetos[Math.floor(Math.random() * sujetos.length)]

        const prompt = `${sujeto}, ${estilo}, ${color}, profile picture, centered composition, clean background, high quality, 256x256`

        console.log(`🎨 Generando avatar IA con prompt: "${prompt}"`)


        // ═══════════════════════════════════════════════════════
        // PASO 2: LLAMAR A HUGGING FACE INFERENCE API
        // Usamos Stable Diffusion XL Base 1.0 para generación de imágenes
        // ═══════════════════════════════════════════════════════

        const respuestaHF = await axios.post(
            'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
            { inputs: prompt },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                responseType: 'arraybuffer',   // Recibimos el binario de la imagen directamente
                timeout: 60000                  // 60 segundos de timeout (la generación puede tardar)
            }
        )

        // Verificamos que la respuesta sea una imagen válida
        const contentType = respuestaHF.headers['content-type']
        if (!contentType || !contentType.includes('image')) {
            // Si Hugging Face devuelve JSON en vez de imagen (ej: modelo cargando), parseamos el error
            const textoError = Buffer.from(respuestaHF.data).toString('utf-8')
            console.warn('⚠️ Hugging Face no devolvió una imagen:', textoError)
            return null
        }

        const bufferImagen = Buffer.from(respuestaHF.data)
        console.log(`✅ Imagen generada por IA: ${bufferImagen.length} bytes`)


        // ═══════════════════════════════════════════════════════
        // PASO 3: SUBIR A CLOUDINARY
        // Usamos la función de config/cloudinary.js que maneja streamifier
        // ═══════════════════════════════════════════════════════

        const publicId = `avatar_${userId}_${Date.now()}`
        const urlCloudinary = await subirBufferACloudinary(bufferImagen, publicId)

        console.log(`☁️ Avatar subido a Cloudinary: ${urlCloudinary}`)

        return urlCloudinary

    } catch (error) {
        // ═══════════════════════════════════════════════════════
        // MANEJO DE ERRORES GRACIOSO (Graceful Degradation)
        // Si la IA falla o Cloudinary está caído, NO bloqueamos el registro
        // ═══════════════════════════════════════════════════════

        if (error.response?.status === 503) {
            console.warn('⚠️ Modelo de Hugging Face está cargando. Avatar no generado.')
        } else if (error.response?.status === 401) {
            console.error('❌ API Key de Hugging Face inválida. Verifica HUGGINGFACE_API_KEY en .env')
        } else if (error.code === 'ECONNABORTED') {
            console.warn('⚠️ Timeout al generar avatar con IA. Se omite el avatar.')
        } else {
            console.error('❌ Error generando avatar IA:', error.message)
        }

        // Retornamos null: el usuario se registra sin foto de perfil
        return null
    }
}


export { generarAvatarIA }
