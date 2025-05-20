const pool = require("../config/db")


const personalEventsTableModel = {

    insertPersonalEvent: async (id_user, day, month, year, title, cursinho, descricao, foto, link, type, color, main_title) => {
        const values = [id_user, day, month, year, title, cursinho, descricao, foto, link, type, color, main_title]

        try {
            const query = "INSERT INTO personal_events (id_user, day, month, year, title, cursinho, descricao, foto, link, type, color, main_title) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)"
            return await pool.query(query, values)
        } catch (err) {
            throw err
        }
    },

    getPersonalEvents: async (id_user) => {
        const values = [id_user]

        try {
            const query = "SELECT * FROM personal_events WHERE id_user = $1"
            return await pool.query(query, values)
        } catch (err) {
            throw err
        }
    },


    insertPersonalLocalEvent: async (id_user, day, month, year, title, descricao, color, main_title, hora, isImportant) => {
        const values = [id_user, day, month, year, title, descricao, color, main_title, hora, isImportant]

        try {
            const query = "INSERT INTO personal_events (id_user, day, month, year, title, descricao, color, main_title, hora, isImportant) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)"
            return await pool.query(query, values)
        } catch (err) {
            throw err
        }

    }
}

module.exports = personalEventsTableModel