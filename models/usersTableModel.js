const pool = require("../config/db")
const jwt = require("jsonwebtoken")
const cryptr = require("../cryptr/cryptr")
const multer = require("multer")



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

    loginAccount: async (email, password) => {
        const values = [password, email]

        try {
            const query = "SELECT * FROM users_table WHERE senha = $1 AND email = $2"
            return await pool.query(query, values)
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
    },

    registerAccount: async (nome, foto, estado, nivel, escola, ano, vestibulares, materiasLecionadas, passouVestibular, universidade, curso, formouEM, trabalha, instituicao, email) => {
        const values = [nome, estado, nivel]
        const token = jwt.decode(email)

        try {

            switch (values[2]) {
                case "Aluno EM":
                    values.push(escola, ano, vestibulares, token.email)

                    return await pool.query("UPDATE users_table SET nome = $1, estado = $2, nivel = $3, escola = $4, ano = $5, vestibulares = $6 WHERE email = $7", values)
                case "Universitário":
                    values.push(passouVestibular, universidade, curso, token.email)

                    return await pool.query("UPATE users_table SET nome = $1, estado = $2, nivel = $3, passouVestibular = $4, universidade = $5, curso = $6 WHERE email = $7", values)
                case "Vestibulando":
                    values.push(formouEM, trabalha, vestibulares, token.email)

                    return await pool.query("UPDATE users_table SET nome = $1, estado = $2, nivel = $3, formouEM = $4, trabalha = $5, vestibulares = $6 WHERE email = $7", values)
                case "Professor":
                    values.push(instituicao, materiasLecionadas, token.email)

                    return await pool.query("UPDATE users_table SET nome = $1, estado = $2, nivel = $3, instituicao = $4, materiasLecionadas = $5 WHERE email = $6", values)
            }
        } catch (err) {
            throw err
        }
    }








}



module.exports = usersTableModel