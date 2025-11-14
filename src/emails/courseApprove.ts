import resend from "../config/smtp"
import courseApproveHtml from "../views/emails/courseApproveHtml";

const sendCourseApproveEmail = async (destinatario: string) => {

    try {
        const data = await resend.emails.send({
            from: "VemFacul <no-reply@vemfacul.com>",
            to: destinatario,
            subject: 'Seu cursinho foi aprovado!',
            html: courseApproveHtml(),
        });
        console.log('✅ Email de confirmação de criação de cursinho enviado com sucesso!')
    } catch (error) {
        console.log("❌ Um erro foi encontrado ao enviar o email de criação de cursinho." + error)
    }
}

export default sendCourseApproveEmail