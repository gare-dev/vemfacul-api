import jwt from "jsonwebtoken"

async function getDecodedJwt(token: any) {
    if (!token) {
        throw new Error("JWT is required");
    }
    try {
        const secret = process.env.SECRET!;
        return jwt.verify(token, secret);
    } catch (error) {
        throw new Error("Invalid JWT: " + error);
    }

}

export default getDecodedJwt;