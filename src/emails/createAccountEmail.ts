import transporter from "../config/smtp"
import createAccountHtml from "../views/emails/createAccountHtml"


const sendConfirmationEmail = async (destinatario: string, confirmationLink: string) => {
    const mailOptions = {
        from: "tccvemfacul@gmail.com",
        to: destinatario,
        subject: "Confirmação de Conta",
        html: createAccountHtml(confirmationLink),
    }

    try {
        transporter.sendMail(mailOptions)
        console.log('✅ Email de confirmação de conta enviado com sucesso!')

    } catch (error) {
        console.log("❌ Um erro foi encontrado ao enviar o email de confirmação de conta." + error)
    }
}

export default sendConfirmationEmail