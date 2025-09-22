import express, { Request, Response, NextFunction } from "express";
import { NotificationsService } from "../services/NotificationsService";
import { NotificationsRepository } from "../repositories/NotificationsRepository";
import authGuard from "../middleware/authGuard";

const router = express.Router()
const services = new NotificationsService(new NotificationsRepository())

router.get("/notifications/:mode", authGuard, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id_user = +req.user.id
        const mode = req.params.mode
        const notifications = await services.getNotifications(id_user, mode)

        res.status(200).json({
            data: notifications.rows
        })
    } catch (err) {
        next(err)
    }
})

export default router 