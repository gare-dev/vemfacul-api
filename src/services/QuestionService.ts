import { JWTClass } from "../../utils/jwt";
import { CustomError } from "../errors/HttpError";
import { QuestoesRepository } from "../repositories/QuestoesRepository";

export class QuestionService {
    constructor(
        private repository: QuestoesRepository,
        private jwtHandler: JWTClass
    ) { }

    async addQuestion(index: number, id_disciplines: number, year: number) {
        if (index > 180 || index < 1 || year < 2009 || year > 2023) throw new CustomError("Index ou Ano da questão invalido", 400, "INVALID_YEAR_INDEX");
        const verifyQuestion = await this.repository.selectQuestoes(index, year)
        if (verifyQuestion.rowCount) throw new CustomError("Essa questao já foi cadastrada", 400, "QUESTION_ALREDY_EXISTIS")
        this.repository.insertQuestoes(index, id_disciplines, year)
    }

    async questionToUser(token: string, isCorret: boolean, index: number, year: number, id_diciplina: number) {
        if(!token) throw new CustomError("ID do usuário é necessário para criar uma questao", 400, "MISSING_IDUSER")
        
        const decoded = this.jwtHandler.verifyJWT(token)
        const id_user = String(decoded?.id)

        const verifyQuestion = await this.repository.selectQuestoes(index, year)
        if (verifyQuestion.rowCount) {
            const id_questao = verifyQuestion.rows[0].id
            console.log(id_questao)
            this.repository.insertQuestoesToUser(id_questao, id_user, isCorret)
        }
        else {
            this.repository.insertQuestoes(index, id_diciplina, year)
            const newQuestion = await this.repository.selectQuestoes(index, year)
            const id_questao = newQuestion.rows[0].id
            console.log(id_questao)
            this.repository.insertQuestoesToUser(id_questao, id_user, isCorret)
        }
    }
}