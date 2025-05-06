const pool = require("../config/db")


const eventsTableModel = {
    createEvent: async (day, month, year, title, cursinho, descricao) => {
        const values = [day, month, year, title, cursinho, descricao]

        try {
            const query = "INSERT INTO events_table (day, month, year, title, cursinho, descricao) VALUES ($1, $2, $3, $4, $5, $6)"
            return pool.query(query, values)
        } catch (err) {
            throw err
        }

    }
}

module.exports = eventsTableModel