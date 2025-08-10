const pool = require("../config/db")
const jwt = require("jsonwebtoken")


const adminTableModel = {
    selectAdmin: async (login, password) => {
        const values = [login, password];

        try {
            const query = "SELECT * FROM admin_table WHERE login = $1 AND password = $2";
            return await pool.query(query, values);
        } catch (error) {
            throw new Error("Error selecting admin: " + error);
        }
    },

    adminAuth: async (token) => {

        if (!token) {
            return false;
        }

        try {
            jwt.verify(token, process.env.SECRET);
            return jwt.decode(token);

        } catch (err) {
            console.log("Erro ao verificar o token de administrador: ", err);
            return false;
        }
    }
}

module.exports = adminTableModel;