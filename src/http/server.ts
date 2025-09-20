import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import UserRoutes from "../routes/UserRoutes"
import QuestoesRouter from "../routes/QuestoesRouter"
import EventRoutes from "../routes/EventRoutes"
import PostRoutes from "../routes/PostRoutes"
import Adminroutes from "../routes/AdminRoutes"
import PersonalEventRoutes from "../routes/PersonalEventRoutes"
import CourseRoutes from "../routes/CourseRoutes"
import ReviewRoutes from "../routes/ReviewRoutes"
import RequestLoggerRoutes from "../routes/RequestLogsRoutes"
import { errorHandler } from "../middleware/errorHandler";
import { requestLogger } from "../middleware/requestLogger";
import { errorLogger } from "../middleware/errorLogger";
import { JWTClass } from "../../utils/jwt";

const app = express()

app.use(cors({
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "https://invest-liard.vercel.app",
        "https://www.chapera.org",
        "https://www.chapaera.org"
    ]
}));
app.use(express.json())
app.use(cookieParser())

// app.use(requestLogger)

app.use(UserRoutes)
app.use(EventRoutes)
app.use(PostRoutes)
app.use(Adminroutes)
app.use(PersonalEventRoutes)
app.use(CourseRoutes)
app.use(ReviewRoutes)
app.use(QuestoesRouter)
app.use(RequestLoggerRoutes)

app.use(errorLogger)
app.use(errorHandler)

export default app