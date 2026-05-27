import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

const transporter = nodemailer.createTransport({

    host: process.env.HOST_MAILTRAP, 
    port: Number(process.env.PORT_MAILTRAP), 
    secure: process.env.PORT_MAILTRAP === "465", 
    auth: {
        user: process.env.USER_MAILTRAP,
        pass: process.env.PASS_MAILTRAP,
    },
    // Añadimos TLS opcional para evitar bloqueos en servidores en la nube
    tls: {
        rejectUnauthorized: false
    }
})

/**
 * Función genérica para enviar correos
 * @param {string} to - Email del destinatario
 * @param {string} subject - Asunto del correo
 * @param {string} html - Contenido HTML del correo
 */
const sendMail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: '"Sistema de Prácticas ESFOT" <no-reply@epn.edu.ec>',
            to,
            subject,
            html,
        })
        console.log("✅ Email enviado:", info.messageId)
        return info // Es buena práctica retornar la info por si el controlador la necesita
    } catch (error) {
        console.error("❌ Error enviando email:", error.message)
        throw error // 5. ¡CRÍTICO! Lanzamos el error para que el controlador sepa que falló
    }
}

export default sendMail