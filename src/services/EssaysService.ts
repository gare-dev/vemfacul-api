import { JWTClass } from "../../utils/jwt";
import { Redis } from "../../utils/redis";
import { CustomError } from "../errors/HttpError";
import { EssaysRepository } from "../repositories/EssaysRepository";


export class EssaysService {
    constructor(
        private repository: EssaysRepository,
        private jwtHandler: JWTClass,
        private redis: Redis
    ) { }

    async insertEssay(id_user: string, essay: string, title: string, theme: string) {
        if (!essay) throw new CustomError("Redação não encontrada", 400, "NOTFOUND_ESSAY")

        await this.repository.insertEssay(id_user, essay, title, theme)

        return { notes: "Muito boa redação.", score: "1000" }
    }

    async getUserEssays(id_user: string) {

        return await this.repository.getUserEssays(id_user)
    }
}