import { JWTClass } from "../../utils/jwt";
import { CustomError } from "../errors/HttpError";
import { AdminRepository } from "../repositories/AdminRepository";


export class AdminService {
    constructor(private repository: AdminRepository, private jwtHandler: JWTClass) { }

    async adminLogin(username: string, password: string) {
        if (!username) throw new CustomError("Email ou senha inválidos.", 400, "WRONG_LOGIN")
        if (!password) throw new CustomError("Email ou senha inválidos.", 400, "WRONG_LOGIN")

        const admin = await this.repository.selectAdmin(username, password)

        if (admin.rowCount === 0) {
            throw new CustomError("Email ou senha inválidos.", 400, "INVALID_CREDENTIALS")
        }
        return this.jwtHandler.generateJWT({ id: admin.rows[0].id_admin, login: admin.rows[0].login })
    }

    async adminAuth(token: string | string[] | undefined) {
        if (typeof token !== "string") {
            throw new CustomError("Tipo do token inválido.", 401, "INVALID_TOKEN")
        }

        if (!token) {
            throw new CustomError("Token de autenticação não encontrado.", 401, "INVALID_TOKEN")
        }

        const authenticated_token = this.jwtHandler.verifyJWT(token)

        if (!authenticated_token) {
            throw new CustomError("Token inválido", 401, "INVALID_TOKEN")
        }
        return authenticated_token
    }
}