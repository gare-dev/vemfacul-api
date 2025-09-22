// import express, { Request, Response, NextFunction } from "express";
// import { NotificationsService } from "../services/NotificationsService";
// import { NotificationsRepository } from "../repositories/NotificationsRepository";
// import { JWTClass } from "../../utils/jwt";
// import authGuard from "../middleware/authGuard";

// const router = express.Router()
// const services = new NotificationsService(new NotificationsRepository(), new JWTClass(process.env.SECRET!))

// router.patch("/notifications/insert", authGuard, async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const id_actor = +req.user.id
//         const { id_post, id_user, type } = req.body
//         await services.createNotifications(id_actor, id_user, id_post, type)
        
//         res.sendStatus(201)
//     } catch (err) {
//         next(err)
//     }
// })

// export default router 