import app from "./http/server"

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`🟢 Server running on port ${PORT}`)
})