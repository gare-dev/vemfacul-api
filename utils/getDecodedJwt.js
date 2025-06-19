const jwtt = require("jsonwebtoken")

async function getDecodedJwt(jwt) {
    if (!jwt) {
        throw new Error("JWT is required");
    }
    try {
        const secret = process.env.SECRET;
        return jwtt.verify(jwt, secret);
    } catch (error) {
        throw new Error("Invalid JWT: " + error);
    }

}

module.exports = getDecodedJwt;