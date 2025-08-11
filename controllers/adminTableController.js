const adminTableModel = require("../models/adminTableModel");
const jwt = require("jsonwebtoken")

const adminTableController = {
    selectAdmin: async (req, res) => {
        const { username, password } = req.body;

        try {
            const response = await adminTableModel.selectAdmin(username, password);

            if (response.rowCount > 0) {
                const token = jwt.sign(
                    {
                        id: response.rows[0].id_admin,
                        login: response.rows[0].login
                    },
                    process.env.SECRET,
                    {
                        expiresIn: '1h'
                    }
                )
                return res.status(200).json({
                    message: "Usuário autenticado com sucesso!",
                    code: "ADMIN_AUTHENTICATED",
                    auth: token
                });
            }
            return res.status(401).json({
                message: "Usuário ou senha inválidos.",
                code: "INVALID_CREDENTIALS"
            });

        } catch (error) {
            return res.status(500).json({
                message: "Nós estamos enfrentando problemas, por favor, tente novamente mais tarde.",
                error: error.toString(),
            });
        }
    },

    adminAuth: async (req, res) => {
        const token = req.headers['admin-token']

        if (typeof token !== 'string') {
            return res.status(401).json({
                message: "Tipo do token inválido.",
                code: "INVALID_TOKEN"
            });
        }

        if (!token) {
            return res.status(401).json({
                message: "Token de autenticação não encontrado.",
                code: "INVALID_TOKEN"
            });
        }

        try {
            const isValid = await adminTableModel.adminAuth(token);

            if (isValid) {
                return res.status(200).json({
                    message: "Admin autenticado com sucesso!",
                    code: "ADMIN_AUTHENTICATED",
                    data: {
                        username: isValid.login,
                        id: isValid.id
                    }
                })
            }


            return res.status(401).json({
                message: "Token de autenticação inválido.",
                code: "INVALID_TOKEN",

            });
        } catch (error) {
            return res.status(500).json({
                message: "Nós estamos enfrentando problemas, por favor, tente novamente mais tarde.",
                error: error.toString(),
                code: "INVALID_TOKEN"
            });
        }
    }
}

module.exports = adminTableController;