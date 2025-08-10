const adminTableModel = require("../models/adminTableModel");


async function getAdminAuth(req, res, next) {
    const token = req.headers['admin-token'];

    if (typeof token !== 'string') {
        return res.status(401).json({
            message: "Tipo do token inválido.",
            code: "INVALID_TOKEN_TYPE"
        });
    }

    if (!token) {
        return res.status(401).json({
            message: "Token de autenticação não encontrado.",
            code: "UNFOUND_TOKEN"
        });
    }

    try {
        const isValid = await adminTableModel.adminAuth(token);

        if (isValid) {
            return next();
        }

        return res.status(401).json({
            message: "Token de autenticação inválido.",
            code: "INVALID_TOKEN"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Nós estamos enfrentando problemas, por favor, tente novamente mais tarde.",
            error: error.toString(),
            code: "INVALID_TOKEN"
        });
    }

}

module.exports = getAdminAuth;