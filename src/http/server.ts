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

app.use(cors())
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