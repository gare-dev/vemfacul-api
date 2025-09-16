import express, { NextFunction, Request, Response } from "express"
import authGuard from "../middleware/authGuard";
import { EventService } from "../services/EventService";
import { EventsRepository } from "../repositories/EventRepository";
import { MulterFile } from "../../utils/uploadPhoto";
import upload from "../config/multer";
import courseAdminAuth from "../middleware/courseAdminAuth";


const router = express.Router()
const service = new EventService(new EventsRepository())

router.post("/course/admin/event", courseAdminAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { day, month, year, title, descricao, link, type, main_title, hora } = req.body
        const id_cursinho = req.id_cursinho

        await service.createCourseAdminEvent(id_cursinho, day, month, year, title, descricao, link, type, main_title, hora)

        return res.sendStatus(201)
    } catch (err) {
        next(err)
    }
})

router.post("/event", upload.single("imagem"), authGuard, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = JSON.parse(req.body.userData)
        const image = req.file as MulterFile

        await service.createEvent(data, image, req.user.id)

        return res.status(201).json({
            message: "Evento criado com sucesso."
        })
    } catch (err) {
        next(err)
    }
})

router.get("/events", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const events = await service.getEvents()

        return res.status(200).json({
            data: events
        })
    } catch (err) {
        next(err)
    }
})

export default router