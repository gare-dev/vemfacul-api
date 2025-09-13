import express, { NextFunction, Request, Response } from "express"
import { RequestLogsService } from "../services/RequestLogsService"
import { RequestLogsRepository } from "../repositories/RequestLogsRepository"
import adminAuth from "../middleware/adminAuth"


const router = express.Router()
const service = new RequestLogsService(new RequestLogsRepository())

router.get("/admin/api/log", adminAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const log = await service.selectAdminLog()

        return res.status(200).json({
            data: log
        })
    } catch (err) {
        next(err)
    }
})

export default router