import express, { NextFunction, Request, Response } from "express";
import { QuestionService } from "../services/QuestionService";
import { QuestoesRepository } from "../repositories/QuestoesRepository";
import { JWTClass } from "../../utils/jwt";

const router = express.Router()
const service = new QuestionService(new QuestoesRepository(), new JWTClass(process.env.SECRET!))

router.post("/exercicios/questoes", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { index, id_disciplines, year } = req.body
        await service.addQuestion(index, id_disciplines, year)
        return res.status(201).json({
            message: "questao cadastrada com sucesso",
            code: "REGISTERED_QUESTION"
        })
    } catch (err) {
        console.log(err)
        next(err)
    }
})

router.post("/exercicios/questoes/usuario", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { isCorret, index, year, id_disciplines } = req.body
        const token = req.cookies.token;

        await service.questionToUser(token, isCorret, index, year, id_disciplines)
        res.status(200).json({
            message: "Questao feita com sucesso",
            code: "QUESTION_MADE"
        })
    } catch (err) {
        console.log(err)
        next(err)
    }
})

export default router