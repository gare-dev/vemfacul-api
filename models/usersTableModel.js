const pool = require("../config/db")
const jwt = require("jsonwebtoken")
const cryptr = require("../cryptr/cryptr")



const usersTableModel = {
    createAccount: async (password, email) => {
        const values = [password, email]

        try {
            const query = "INSERT INTO users_table (senha, email) VALUES ($1, $2)"
            return await pool.query(query, values)
        } catch (err) {
            throw err
        }
    },

    confirmAccount: async (token) => {
        const login = jwt.decode(token)
        const values = [login.email]

        try {
            const query = "UPDATE users_table SET is_verified = TRUE WHERE email = $1"
            return pool.query(query, values)
        } catch (err) {
            throw err
        }
    },

    checkAccount: async (email) => {
        const values = [cryptr.decrypt(email)]


        try {
            const query = "SELECT * FROM users_table WHERE email = $1"
            const result = await pool.query(query, values)
            return result
        } catch (err) {
            throw err
        }
    }

}

module.exports = usersTableModel