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
    // deletPostagem
    // [more ...]
    selectPostagem: async (username) => {
        const values = [username]

        try {
            const query = `
select
    p.content,
    p.created_at,
    u.username
from
    postagens_table p
    join users_table u on p.id_user = u.id_user
where 
    u.username like $1
order by
    p.id_postagem desc
`
            console.log(query, values)
            return await pool.query(query, values)
        } catch (err) {
            throw err
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