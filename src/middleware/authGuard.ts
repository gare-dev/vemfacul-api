import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import { Redis } from "../../utils/redis";

const redis = new Redis()

export interface User {
    id: string,
    email: string,
    nome: string,
    username: string
}

async function authGuard(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token;
    if (!token) {
        console.log("🔒 Auth Guard Middleware Executed. User tried to login without token.");
        return res.status(401).json({
            message: "Você não está autenticado, por favor, faça login.",
            code: "INVALID_TOKEN"
        });
    }

    try {
        const decoded_token = jwt.verify(token, process.env.SECRET!) as { id: number, email: string };

        const user = await redis.getRedis(`user_${decoded_token.id}`) as User
        if (user) {
            console.log(`👤 User "${user.username}" ID "${user.id}" is logged in!`)
            req.user = user
            return next()
        }
        return res.status(401).json({
            message: "Sessão inválida ou expirada. Por favor, faça login novamente.",
            code: "SESSION_INVALID"
        });

    } catch (error) {
        console.log(error)
        return res.status(401).json({
            message: "Token de autenticação inválido.",
            code: "INVALID_TOKEN"
        });
    }
}

export default authGuard;
