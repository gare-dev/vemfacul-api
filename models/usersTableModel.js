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

    updatePhoto: async (fotoUrl, email) => {
        const emailJwt = jwt.decode(email)

        const values = [fotoUrl, emailJwt.email]

        try {
            const query = "UPDATE users_table SET foto = $1 WHERE email = $2"
            return pool.query(query, values)
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

    forgotPassword: async (email) => {
        const values = [email]

        try {
            const query = "SELECT * FROM users_table WHERE email = $1";
            return pool.query(query, values)
        } catch (err) {
            throw err
        }


    },

    forgotPasswordAccount: async (password, email) => {
        const values = [password, email]

        try {
            const query = "UPDATE users_table SET senha = $1 WHERE email = $2"
            return pool.query(query, values)
        } catch (err) {
            throw err
        }
    },

    loginAccount: async (email, password) => {
        const values = [password, email];
        try {
            const query = "SELECT * FROM users_table WHERE senha = $1 AND email = $2";
            return await pool.query(query, values);
        } catch (err) {
            throw err;
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
    },

    getUserProfile: async (username) => {
        const values = [username]

        try {

            const query = "SELECT nome, username, foto, header, descricao, followers, following, posts_number, vestibulares, materias_lecionadas, nivel FROM users_table WHERE username = $1"
            return await pool.query(query, values)
        } catch (err) {
            throw err
        }
    },

    changeUserPhoto: async (foto, id) => {
        const values = [foto, id]

        try {
            const query = "UPDATE users_table SET foto = $1 WHERE id_user = $2"
            return await pool.query(query, values)
        } catch (err) {
            throw err
        }

    },

    editProfile: async (name, descricao, foto, header, id_user) => {
        const values = [name, descricao, foto, header, id_user]

        try {
            const query = "UPDATE users_table SET nome = $1, descricao = $2, foto = $3, header = $4 WHERE id_user = $5 "
            return await pool.query(query, values)
        } catch (err) {
            throw err
        }
    },

    editProfileDynamic: async (fields, id_user) => {
        const setParts = [];
        const values = [];
        let i = 1;

        for (const [key, value] of Object.entries(fields)) {
            setParts.push(`${key} = $${i}`);
            values.push(value);
            i++;
        }

        if (setParts.length === 0) {
            throw new Error("Nenhum campo para atualizar.");
        }

        const query = `UPDATE users_table SET ${setParts.join(', ')} WHERE id_user = $${i}`;
        values.push(id_user);

        try {
            return await pool.query(query, values);
        } catch (err) {
            throw err;
        }
    },

    getProfileInfo: async (id_user) => {
        const values = [id_user]

        try {
            const query = "SELECT nome, username, foto FROM users_table WHERE id_user = $1"
            return await pool.query(query, values)
        } catch (err) {
            throw err
        }
    }

}



module.exports = usersTableModel