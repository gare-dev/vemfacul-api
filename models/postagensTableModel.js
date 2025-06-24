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
SELECT
    p.id_postagem,
    p.content,
    p.created_at,
    u.username,
    u.id_user,
    (
        SELECT COUNT(*) 
        FROM postagenslike_table l 
        WHERE l.id_postagem = p.id_postagem
    ) AS total_likes
FROM
    postagens_table p
JOIN
    users_table u ON p.id_user = u.id_user
WHERE
    u.username LIKE $1
ORDER BY
    p.id_postagem DESC;

   
`
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
    },
    getLikesCout: async (id_postagem) => {
        const values = [id_postagem]

        try {
            const query = `
select
  (
    select
      count(*)
    from
      postagenslike_table l
    where
      p.id_postagem = l.id_postagem
  ) as like_count
from
  postagenslike_table l
  join postagens_table p on p.id_postagem = l.id_postagem
  join users_table u on p.id_user = u.id_user
  and l.id_user = u.id_user
where 
p.id_postagem = $1
            `

            return await pool.query(query, values)
        } catch (err) {
            throw err;
        }
    },


    selectAllPosts: async () => {
        try {
            const query = `
            SELECT
                p.id_postagem,
                p.content,
                p.created_at,
                u.username,
                u.id_user,
                u.nome,
                u.foto,
                (
                    SELECT COUNT(*) 
                    FROM postagenslike_table l 
                    WHERE l.id_postagem = p.id_postagem
                ) AS total_likes
            FROM
                postagens_table p
            JOIN
                users_table u ON p.id_user = u.id_user
            ORDER BY
                p.created_at DESC;`
            return await pool.query(query)
        } catch (err) {
            throw err;
        }
    }
}

module.exports = postagensTableModel