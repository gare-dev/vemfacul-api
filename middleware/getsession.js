const { getRedis } = require("../config/redisConfig");
const { get } = require("../config/smtp");
const getDecodedJwt = require("../utils/getDecodedJwt");


async function getSession(req, res, next) {
    const token = await getDecodedJwt(req.headers.authorization.split(" ")[1])
    const idUser = token.id
    if (await getRedis(`user_${idUser}`)) {
        return next();
    }
    return res.status(401).json({
        message: "Sessão inválida ou expirada. Por favor, faça login novamente.",
        code: "SESSION_INVALID"
    });

}


module.exports = getSession;