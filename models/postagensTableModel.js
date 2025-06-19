const pool = require('../config/db');
const jwt = require('jsonwebtoken')

const postagensTableModel = {
    createPostagem: async (user_id, content) => {
        const values = [user_id, content]

        try {
            const query = 'INSERT INTO postagens_table (id_user, content) VALUES ($1, $2)'
            return await pool.query(query, values)
        } catch (err) {
            throw err;
        }
    },
    likePostagem: async (id_postagem, id_user) => {
        const values = [id_postagem, id_user]

        try {
            const query = "INSERT INTO postagensLike_table (id_postagem, id_user)  VALUES ($1, $2) ON CONFLICT DO NOTHING"
            return pool.query(query, values)
        } catch (err) {
            throw err;
        }
    },
    unlikePostagem: async (id_postagem, id_user) => {
        const values = [id_postagem, id_user]

        try {
            const query = "DELETE FROM postagensLike_table WHERE id_postagem = $1 AND id_user = $2"
            return await pool.query(query, values)
        } catch (err) {
            throw err;
        }
    }
}

module.exports = postagensTableModel