import express, { NextFunction, Request, Response } from "express"
import { PersonalEventService } from "../services/PersonalEventService"
import { PersonalEventRepository } from "../repositories/PersonalEventRepository"
import authGuard from "../middleware/authGuard"
import { CreatePersonalEventType, CreatePersonalLocalEventType } from "../db/types/PersonalEventType"

const router = express.Router()
const service = new PersonalEventService(new PersonalEventRepository())

router.post("/user/event", authGuard, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data: CreatePersonalEventType = req.body

        await service.insertPersonalEvent({ ...data, id_user: req.user.id })

        return res.sendStatus(201)
    } catch (err) {
        next(err)
    }
})

router.get("/user/event", authGuard, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id_user = req.user.id

        const personal_events = await service.getPersonalEventsById(id_user)

        return res.status(200).json({
            data: personal_events
        })
    } catch (err) {
        next(err)
    }
})

router.post("/user/local/event", authGuard, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data: CreatePersonalLocalEventType = req.body

        await service.insertPersonalLocalEvent({ ...data, id_user: req.user.id })

        return res.sendStatus(201)
    } catch (err) {
        next(err)
    }
})

router.delete("/user/event", authGuard, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id_pevent } = req.body
        const id_user = req.user.id

        await service.deletePersonalEvent(id_pevent, id_user)

        return res.sendStatus(200)

    } catch (err) {
        next(err)
    }
})

export default router