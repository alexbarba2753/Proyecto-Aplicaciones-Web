import sendMail from "../config/nodemailer.js"

/**
 * Envía el correo de confirmación de cuenta para el sistema de la ESFOT
 * @param {string} userMail - Correo institucional del usuario
 * @param {string} token - Token de validación único generado por Mongoose
 */

const sendMailToRegister = (userMail, token) => {
    return sendMail(
        userMail,
        "Confirmación de Cuenta - Sistema de Prácticas ESFOT",
        `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                <h2 style="color: #003366;">Control de Prácticas Preprofesionales ESFOT</h2>
                <hr style="border: 0; border-top: 1px solid #003366;"/>
                <p>Estimado/a usuario,</p>
                <p>Se ha registrado una cuenta asociada a esta dirección de correo electrónico en la plataforma de gestión y seguimiento de prácticas.</p>
                <p>Para activar su cuenta y validar su acceso, por favor haga clic en el siguiente enlace institucional:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.URL_BACKEND}confirmar/${token}" 
                        style="background-color: #003366; color: white; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">
                        Confirmar Cuenta
                    </a>
                </div>
                
                <p style="font-size: 12px; color: #666;">Si usted no solicitó este registro, por favor ignore este mensaje de correo electrónico.</p>
                <hr style="border: 0; border-top: 1px solid #e0e0e0; margin-top: 30px;"/>
                <footer style="font-size: 11px; color: #888; text-align: center;">
                    Este es un mensaje automático generado por el Sistema de Gestión de Prácticas Preprofesionales de la ESFOT.
                </footer>
            </div>
        `
    )
}

/**
 * Envía el correo de recuperación de contraseña para el sistema de la ESFOT
 * @param {string} userMail - Correo institucional del usuario que olvidó la clave
 * @param {string} token - Nuevo token de recuperación generado temporalmente
 */
const sendMailToRecoveryPassword = (userMail, token) => {
    return sendMail(
        userMail,
        "Restablecimiento de Contraseña - Sistema de Prácticas ESFOT",
        `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                <h2 style="color: #003366;">Control de Prácticas Preprofesionales ESFOT</h2>
                <hr style="border: 0; border-top: 1px solid #003366;"/>
                <p>Estimado/a usuario,</p>
                <p>Recibimos una solicitud para restablecer la contraseña de su cuenta en la plataforma de gestión de prácticas preprofesionales.</p>
                <p>Para generar una nueva contraseña de acceso, por favor haga clic en el siguiente enlace seguro:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.URL_BACKEND}recuperarpassword/${token}" 
                        style="background-color: #003366; color: white; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">
                        Restablecer Contraseña
                    </a>
                </div>
                
                <p style="font-size: 12px; color: #666;">Si usted no realizó esta solicitud, puede ignorar este mensaje con total seguridad; su contraseña actual se mantendrá sin cambios.</p>
                <hr style="border: 0; border-top: 1px solid #e0e0e0; margin-top: 30px;"/>
                <footer style="font-size: 11px; color: #888; text-align: center;">
                    Este es un mensaje automático generado por el Sistema de Gestión de Prácticas Preprofesionales de la ESFOT.
                </footer>
            </div>
        `
    )
}

// Exportamos ambas funciones para que tu controlador pueda usarlas cuando las necesite
export {
    sendMailToRegister,
    sendMailToRecoveryPassword
}