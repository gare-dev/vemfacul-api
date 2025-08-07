import { User } from "../../middleware/authGuard"

declare global {
    namespace Express {
        interface Request {
            user: User
        }
    }
}