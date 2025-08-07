import { Request, Response, NextFunction } from "express";
import { JWTClass } from "../../utils/jwt";

const jwtHandler = new JWTClass(process.env.SECRET!)

async function adminAuth(req: Request, res: Response, next: NextFunction) {
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
        const isValid = jwtHandler.verifyJWT(token)

        if (isValid) {
            return next();
        }

        return res.status(401).json({
            message: "Token de autenticação inválido.",
            code: "INVALID_TOKEN"
        });
    } catch (error: unknown) {
        return res.status(500).json({
            message: "Nós estamos enfrentando problemas, por favor, tente novamente mais tarde.",
            error: error?.toString(),
            code: "INVALID_TOKEN"
        });
    }

}

export default adminAuth