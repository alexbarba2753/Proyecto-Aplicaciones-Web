import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",   
    port: 587,                
    secure: false,            
    auth: {
        user: process.env.USER_MAILTRAP,
        pass: process.env.PASS_MAILTRAP,
    },  
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
            from: '"Sistema de Prácticas ESFOT" <no-reply@gmail.com>',
            to,
            subject,
            html,
        })
        console.log("✅ Email enviado:", info.messageId)

    } catch (error) {
        console.error("❌ Error enviando email:", error.message)
    }
}

export default sendMail
