import express, { NextFunction, Request, Response } from "express";
import { EssaysService } from "../services/EssaysService";
import { EssaysRepository } from "../repositories/EssaysRepository";
import { JWTClass } from "../../utils/jwt";
import { Redis } from "../../utils/redis";
import authGuard from "../middleware/authGuard";

const router = express.Router()
const service = new EssaysService(new EssaysRepository(), new JWTClass(process.env.SECRET!), new Redis())

router.post("/user/essay", authGuard, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { essay, theme, title } = req.body
        const id_user = req.user.id

        await service.insertEssay(id_user, essay, title, theme)

        return res.sendStatus(201)
    } catch (err) {
        next(err)
    }
})

router.get("/user/essay", authGuard, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id_user = req.user.id

        const response = await service.getUserEssays(id_user)

        return res.status(200).json({
            data: response.rows
        })
    } catch (err) {
        next(err)
    }
})

export default router