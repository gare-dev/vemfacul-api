const pool = require("../config/db")


const eventsTableModel = {
    createEvent: async (day, month, year, title, cursinho, descricao, link, color, type, main_title) => {
        const values = [day, month, year, title, cursinho, descricao, link, color, type, main_title]

        try {
            const query = "INSERT INTO events_table (day, month, year, title, cursinho, descricao, link, color, type, main_title) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
            return pool.query(query, values)
        } catch (err) {
            throw err
        }
    },

    updatePhoto: async (foto, id) => {
        const values = [foto, id]

        try {
            const query = "UPDATE events_table SET foto = $1 WHERE id_event = $2"
            return pool.query(query, values)
        } catch (err) {
            throw err
        }
    },

    getEvents: async () => {
        try {
            const query = "SELECT * FROM events_table"
            return pool.query(query)
        } catch (err) {
            throw err
        }
    }
}

module.exports = eventsTableModel