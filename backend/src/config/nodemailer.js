import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
dotenv.config();

// ═══════════════════════════════════════════════════════
// CONFIGURACIÓN DE SENDGRID
// Reemplaza a Nodemailer/Gmail para evitar bloqueos en servidores cloud.
// ═══════════════════════════════════════════════════════
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Función genérica para enviar correos usando SendGrid
 * @param {string} to - Email del destinatario
 * @param {string} subject - Asunto del correo
 * @param {string} html - Contenido HTML del correo
 */
const sendMail = async (to, subject, html) => {
    try {
        const msg = {
            to,
            from: process.env.SENDGRID_SENDER_EMAIL, // Debes usar un email autorizado/verificado en SendGrid
            subject,
            html,
        };

        const response = await sgMail.send(msg);
        console.log("✅ Email enviado vía SendGrid:", response[0].headers['x-message-id']);

    } catch (error) {
        console.error("❌ Error enviando email con SendGrid:", error.response ? error.response.body : error.message);
    }
};

export default sendMail;
