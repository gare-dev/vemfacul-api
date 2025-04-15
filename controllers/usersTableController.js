const usersTableModel = require("../models/usersTableModel")
const sendConfirmationEmail = require("../smtp/createAccount")
const jwt = require("jsonwebtoken")


const usersTableController = {
    createAccount: async (req, res) => {
        const { password, email } = req.body

        try {
            const response = await usersTableModel.createAccount(password, email)

            if (response.rowCount >= 1) {
                const token = jwt.sign(
                    { email: email },
                    process.env.SECRET,
                    {
                        expiresIn: 3600
                    }
                )
                sendConfirmationEmail(email, token)
                return res.status(200).json({
                    message: "Conta criada, cheque o seu email.",
                    code: "ACCOUNT_CREATED_CHECK_EMAIL"
                })
            }
        } catch (error) {
            if (error.code === "23505") {
                return res.status(409).json({
                    message: "Já existe uma conta com esse email.",
                    code: "ALREADYUSED_EMAIL"
                })
            }
            return res.status(500).json({
                message: "Nós estamos enfrentando problemas, por favor, tente novamente mais tarde.",
                error: error
            })
        }
        console.log(error)
    },

    confirmAccount: async (req, res) => {
        const { token } = req.body

        try {
            const response = await usersTableModel.confirmAccount(token)

            if (response.rowCount >= 1) {
                return res.status(200).json({
                    message: "Conta confirmada com sucesso!",
                    code: "CONFIRMED_ACCOUNT"
                })
            }
        } catch (error) {

            return res.status(500).json({
                message: "Nós estamos enfrentando problemas, por favor, tente novamente mais tarde.",
            })
        }
    }
}

module.exports = usersTableController