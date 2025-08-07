import express, { NextFunction, Request, Response } from "express"
import { AdminService } from "../services/AdminService"
import { AdminRepository } from "../repositories/AdminRepository"
import { JWTClass } from "../../utils/jwt"

const router = express.Router()
const service = new AdminService(new AdminRepository(), new JWTClass(process.env.SECRET!))

router.post("/admin/login", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body

        const token = await service.adminLogin(username, password)

        return res.status(200).json({
            code: "ADMIN_AUTHENTICATED",
            auth: token
        })
    } catch (err) {
        next(err)
    }
})

router.get("/admin/auth", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers["admin-token"]

        const authenticated_token = await service.adminAuth(token)

        return res.status(200).json({
            code: "ADMIN_AUTHENTICATED",
            data: {
                username: authenticated_token?.login,
                id: authenticated_token?.id
            }
        })
    } catch (err) {
        next(err)
    }

})

export default router 