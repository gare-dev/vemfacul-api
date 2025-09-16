import express, { NextFunction, Request, Response } from "express";
import { QuestionService } from "../services/QuestionService";
import { QuestoesRepository } from "../repositories/QuestoesRepository";
import { JWTClass } from "../../utils/jwt";

const router = express.Router()
const service = new QuestionService(new QuestoesRepository(), new JWTClass(process.env.SECRET!))

router.post("/exercicios/questoes/usuario", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { isCorret, index, year, id_disciplines } = req.body
        const token = req.cookies.token;

        await service.questionToUser(token, isCorret, index, year, id_disciplines)
        res.sendStatus(200);
    } catch (err) {
        console.log(err)
        next(err)
    }
})

export default router