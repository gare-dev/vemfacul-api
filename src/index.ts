import { JWTClass } from "../utils/jwt"
import sendConfirmationEmail from "./emails/createAccountEmail"
import app from "./http/server"

const PORT = process.env.PORT
const jwt = new JWTClass(process.env.SECRET!)

app.get("/", (req, res) => {
    res.send("OK")
})

app.listen(PORT, () => {
    console.log(`🟢 Server running on port ${PORT}`)
})