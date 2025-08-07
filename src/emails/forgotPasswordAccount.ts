import transporter from "../config/smtp"
import forgotPasswordHtml from "../views/emails/forgotPasswordHtml"
import cryptr from "../config/cryptr"

const sendForgotPasswordEmail = async (destinatario: string) => {
    const destinatarioLink = cryptr.encrypt(destinatario);
    try {

        const mailOptions = {
            from: "tccvemfacul@gmail.com",
            to: destinatario,
            subject: "Recuperação de Senha",
            html: forgotPasswordHtml(destinatarioLink),
        }

        await transporter.sendMail(mailOptions);
        console.log('✅ Email de recuperação de senha enviado com sucesso!')

    } catch (error) {
        console.log("❌ Erro ao enviar email: ", error);
    }
}

export default sendForgotPasswordEmail;