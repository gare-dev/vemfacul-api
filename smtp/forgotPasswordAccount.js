const { transporter } = require("../config/smtp");
const forgotPasswordHtml = require("../emailHtml/forgotPasswordHtml");
const crypto = require("crypto");

const sendForgotPasswordEmail = async (destinatario, resetToken) => {
    try {
 
        const mailOptions = {
            from: "tccvemfacul@gmail.com",
            to: destinatario,
            subject: "Recuperação de Senha",
            html: forgotPasswordHtml(destinatario, resetToken),
        }

        await transporter.mailer.sendMail(mailOptions);
        console.log('EMAIL ENVIADO');
    } catch (error) {
        console.error("Erro ao enviar email:", error);
    }

}

module.exports = sendForgotPasswordEmail;