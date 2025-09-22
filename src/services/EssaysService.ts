import { JWTClass } from "../../utils/jwt";
import { Redis } from "../../utils/redis";
import { CustomError } from "../errors/HttpError";
import { EssaysRepository } from "../repositories/EssaysRepository";
import client from "../config/huggingface"
import formatRedacaoFeedback from "../../utils/formtEssayFeedback";
import { essayQueue } from "../queues/essayQueue";



export class EssaysService {
    constructor(
        private repository: EssaysRepository,
        private jwtHandler: JWTClass,
        private redis: Redis
    ) { }

    async insertEssay(id_user: string, essay: string, title: string, theme: string) {
        if (!essay) throw new CustomError("Redação não encontrada", 400, "NOTFOUND_ESSAY")

        await essayQueue.add("evaluateEssay", { id_user, essay, title, theme })
    }

    async getUserEssays(id_user: string) {

        return await this.repository.getUserEssays(id_user)
    }
}