const { transporter } = require("../config/smtp")
const createAccountHtml = require("../emailHtml/createAccountHtml")


const sendConfirmationEmail = async (destinatario, confirmationLink) => {
  const mailOptions = {
    from: "tccvemfacul@gmail.com",
    to: destinatario,
    subject: "Confirmação de Conta",
    html: createAccountHtml(confirmationLink),
  }

  try {
    transporter.mailer.sendMail(mailOptions)
    console.log('EMAIL ENVIADO')

  } catch (error) {
    console.log("EMAIL NÂO ENVIADO" + error)
  }
}

module.exports = sendConfirmationEmail