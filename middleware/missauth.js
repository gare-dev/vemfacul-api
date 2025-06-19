const jwt = require("jsonwebtoken")


function missAuth(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).json({
            message: "Você não está autenticado, por favor, faça login.",
        });
    }

    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Token de autenticação não encontrado.",
        });
    }

    try {
        jwt.verify(token, process.env.SECRET);
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Token de autenticação inválido.",
        });
    }
}

module.exports = missAuth;