import app from "./http/server"

const PORT = process.env.PORT

app.get("/", (req, res) => {
    res.send("OK")
})

app.get("/health", (req, res) => {
    res.send(process.env.RESEND_API_KEY?.slice(0, 10))
})

app.listen(PORT, () => {
    console.log(`🟢 Server running on port ${PORT}`)
})