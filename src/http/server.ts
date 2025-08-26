import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import UserRoutes from "../routes/UserRoutes"
import EventRoutes from "../routes/EventRoutes"
import PostRoutes from "../routes/PostRoutes"
import Adminroutes from "../routes/AdminRoutes"
import PersonalEventRoutes from "../routes/PersonalEventRoutes"
import CourseRoutes from "../routes/CourseRoutes"
import { errorHandler } from "../middleware/errorHandler";

const app = express()

app.use(cors({
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "https://invest-liard.vercel.app",
        "https://www.chapera.org/"
    ]
}));
app.use(express.json())
app.use(cookieParser())

app.use(UserRoutes)
app.use(EventRoutes)
app.use(PostRoutes)
app.use(Adminroutes)
app.use(PersonalEventRoutes)
app.use(CourseRoutes)

app.use(errorHandler)

export default app