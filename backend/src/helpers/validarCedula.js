import axios from 'axios'

/**
 * Valida una cédula ecuatoriana en dos pasos:
 * 1. Validación local con el algoritmo módulo 10 (estructura y dígito verificador)
 * 2. Consulta a la API de EcuadorAPI para verificar que la persona existe en el Registro Civil
 * 
 * @param {string} cedula - Número de cédula de 10 dígitos
 * @returns {Promise<{nombre: string, apellido: string}>} - Nombres reales del portador
 * @throws {Error} - Si la cédula es inválida o no existe en el registro
 */
const validarCedulaEcuador = async (cedula) => {

    // ═══════════════════════════════════════════════════════
    // PASO 1: VALIDACIÓN LOCAL — Algoritmo Módulo 10
    // Verifica la estructura matemática ANTES de gastar una llamada a la API
    // ═══════════════════════════════════════════════════════

    // Debe ser exactamente 10 dígitos numéricos
    if (!cedula || !/^\d{10}$/.test(cedula)) {
        throw new Error('La cédula debe tener exactamente 10 dígitos numéricos')
    }

    // Los dos primeros dígitos representan la provincia (01-24) o código especial (30)
    const provincia = parseInt(cedula.substring(0, 2), 10)
    if (provincia < 1 || (provincia > 24 && provincia !== 30)) {
        throw new Error('Los dos primeros dígitos de la cédula no corresponden a una provincia válida')
    }

    // El tercer dígito debe ser menor a 6 para cédulas de personas naturales
    const tercerDigito = parseInt(cedula[2], 10)
    if (tercerDigito >= 6) {
        throw new Error('El tercer dígito de la cédula no es válido para persona natural')
    }

    // Algoritmo módulo 10 para verificar el dígito verificador (último dígito)
    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2]
    let suma = 0

    for (let i = 0; i < 9; i++) {
        let valor = parseInt(cedula[i], 10) * coeficientes[i]
        if (valor >= 10) valor -= 9  // Si el producto es >= 10, se resta 9
        suma += valor
    }

    const digitoVerificador = (10 - (suma % 10)) % 10
    if (digitoVerificador !== parseInt(cedula[9], 10)) {
        throw new Error('El dígito verificador de la cédula no es correcto')
    }

    // ═══════════════════════════════════════════════════════
    // PASO 2: CONSULTA A ECUADORAPI — Verificación en Registro Civil
    // Si la cédula es matemáticamente válida, verificamos que la persona exista
    // ═══════════════════════════════════════════════════════

    try {
        const respuesta = await axios.get(
            `https://api.ecuadorapi.com/api/v1/cedulas/${cedula}`,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.ECUADOR_API_KEY}`
                },
                timeout: 10000  // Timeout de 10 segundos para evitar bloqueos
            }
        )

        // La API devuelve los datos de la persona si la cédula es válida
        const datos = respuesta.data

        // Extraemos nombre y apellido de la respuesta de EcuadorAPI
        // La API devuelve un objeto con la propiedad "data" que contiene "first_name" y "last_name"
        const info = datos.data || datos
        const nombreCompleto = info.first_name || info.nombre || info.nombres || info.name || ''
        const apellidoCompleto = info.last_name || info.apellido || info.apellidos || info.surname || ''

        if (!nombreCompleto && !apellidoCompleto) {
            // Si la API respondió pero sin datos de nombre, usamos los datos que vengan
            console.warn('⚠️ EcuadorAPI respondió sin nombres, se usarán los del formulario')
            return { nombre: null, apellido: null }
        }

        return {
            nombre: nombreCompleto.trim(),
            apellido: apellidoCompleto.trim()
        }

    } catch (error) {
        // Si la API devuelve 404 o un error específico, la cédula no existe en el registro
        if (error.response) {
            const status = error.response.status
            if (status === 404 || status === 400) {
                throw new Error('La cédula no es válida o no existe en el registro civil')
            }
            if (status === 401 || status === 403) {
                console.error('❌ Error de autenticación con EcuadorAPI. Verifica tu API Key en .env')
                throw new Error('Error de autenticación con el servicio de verificación de cédula')
            }
            if (status === 429) {
                console.error('❌ Límite de peticiones alcanzado en EcuadorAPI')
                throw new Error('Servicio de verificación temporalmente no disponible. Intenta más tarde')
            }
        }

        // Si es un error de red (timeout, DNS, etc.), lo lanzamos con mensaje descriptivo
        if (error.code === 'ECONNABORTED') {
            throw new Error('El servicio de verificación de cédula no respondió a tiempo')
        }

        // Error genérico
        throw new Error('No se pudo verificar la cédula. Intenta nuevamente')
    }
}


export { validarCedulaEcuador }
