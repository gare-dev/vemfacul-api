import express, { NextFunction, Request, Response } from "express";
import { ReportesPostsService } from "../services/ReportedPostsService";
import { ReportedPostsRepository } from "../repositories/ReportedPostsRepository";
import authGuard from "../middleware/authGuard";


const router = express.Router();
const service = new ReportesPostsService(new ReportedPostsRepository())

router.post("/user/post/report", authGuard, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id_post } = req.body
        const id_user = req.user.id

        await service.reportPost(id_post, id_user)

        res.sendStatus(201)
    } catch (error) {
        next(error)
    }
})

export default router;