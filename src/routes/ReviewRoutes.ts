import express, { NextFunction, Request, Response } from "express"
import { ReviewRepository } from "../repositories/ReviewRepository"
import { JWTClass } from "../../utils/jwt"
import { Redis } from "../../utils/redis"
import { ReviewService } from "../services/ReviewService"
import authGuard from "../middleware/authGuard"


const router = express.Router()
const service = new ReviewService(new ReviewRepository(), new JWTClass(process.env.SECRET!), new Redis())

router.post("/course/review", authGuard, async (req: Request, res: Response, next: NextFunction) => {
    const { id_cursinho, stars, content } = req.body
    const id_user = req.user.id

    try {
        const response = await service.insertReview(id_user, id_cursinho, stars, content)
        res.status(201).json({
            created_at: response.rows[0].created_at
        })
    } catch (error) {
        next(error)
    }
})

export default router