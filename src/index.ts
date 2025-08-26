import { JWTClass } from "../utils/jwt"
import sendConfirmationEmail from "./emails/createAccountEmail"
import app from "./http/server"

const PORT = process.env.PORT
const jwt = new JWTClass(process.env.SECRET!)

app.get("/", (req, res) => {
    res.send("OK")
})

app.get("/teste", (req, res) => {
    const token = jwt.generateJWT({ email: "andrerufatoportela@gmail.com" })

    sendConfirmationEmail("andrerufatoportela@gmail.com", token)
    res.send("Teste")
})

app.listen(PORT, () => {
    console.log(`🟢 Server running on port ${PORT}`)
})