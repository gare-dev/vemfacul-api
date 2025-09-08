import transporter from "../config/smtp"
import createAccountHtml from "../views/emails/createAccountHtml"


const sendConfirmationEmail = async (destinatario: string, confirmationLink: string) => {

    try {
        const data = await transporter.emails.send({
            from: "Equipe Chapera <no-reply@chapera.org>",
            to: destinatario,
            subject: 'Confirme sua conta',
            html: createAccountHtml(confirmationLink),
        });
        console.log(data)
        console.log('✅ Email de confirmação de conta enviado com sucesso!')

    } catch (error) {
        console.log("❌ Um erro foi encontrado ao enviar o email de confirmação de conta." + error)
    }
}

export default sendConfirmationEmail