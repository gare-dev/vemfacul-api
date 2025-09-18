import app from "./http/server"

const PORT = process.env.PORT

app.get("/", (req, res) => {
    res.send("OK")
})


app.listen(PORT, () => {
    console.log(`🟢 Server running on port ${PORT}`)
})