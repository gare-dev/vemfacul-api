import { JWTClass } from "../../utils/jwt";
import { CustomError } from "../errors/HttpError";
import { QuestoesRepository } from "../repositories/QuestoesRepository";

export class QuestionService {
    constructor(
        private repository: QuestoesRepository,
        private jwtHandler: JWTClass
    ) { }
    async questionToUser(token: string, isCorret: boolean, index: number, year: number, id_diciplina: number) {
        if (!token) throw new CustomError("ID do usuário é necessário para criar uma questao", 400, "MISSING_IDUSER");
        if (!index || index < 1 || index > 180) throw new CustomError("Index da questao invalido", 400, "INVALID_INDEX");
        if (!year || year < 2009 || year > 2023) throw new CustomError("Ano da questao invalido", 400, "INVALID_YEAR");

        const decoded = this.jwtHandler.verifyJWT(token)
        const id_user = String(decoded?.id)

        const verifyQuestion = await this.repository.selectQuestoes(index, year)
        if (verifyQuestion.rowCount) {
            const id_questao = verifyQuestion.rows[0].id
            console.log("Está questão já existe: ", id_questao)
            if ((await this.repository.selectQuestoesTouser(id_questao, id_user)).rowCount) {
                console.log("usuario já fez esta questao");
            }
            await this.repository.insertQuestoesToUser(id_questao, id_user, isCorret)
        }
        else {
            const newQuestion = await this.repository.insertQuestoes(index, id_diciplina, year)
            const id_questao = newQuestion.rows[0].id
            console.log("Criando a questao: id_", id_questao)
            await this.repository.insertQuestoesToUser(id_questao, id_user, isCorret)
        }
    }

    async rankinQuestion() {
        const promise = await this.repository.selectRankin();
        return promise.rows
    }

    async getTop10Users(mode: string) {
        return (await this.repository.selectTop10Users(mode)).rows
    }
}